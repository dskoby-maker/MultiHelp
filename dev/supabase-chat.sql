-- MultiHelp — чат клиента с мастером, жалобы, блокировка нарушителей (Supabase).
-- Как установить: Supabase → SQL Editor → New query → вставить весь текст → Run.
-- Запускать ПОСЛЕ dev/supabase-setup.sql. Повторный запуск ничего не ломает.

-- ---------- заблокированные пользователи ----------
create table if not exists public.banned (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.banned enable row level security;
drop policy if exists "banned admin" on public.banned;
create policy "banned admin" on public.banned for all using (public.is_admin()) with check (public.is_admin());
grant select, insert, delete on public.banned to authenticated;

create or replace function public.is_banned(u uuid) returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.banned where user_id = u) $$;

-- заблокированный не может создавать объявления
create or replace function public.listings_guard() returns trigger
language plpgsql security definer set search_path = public as
$$
begin
  if tg_op = 'INSERT' then
    new.owner := auth.uid();
    if public.is_banned(auth.uid()) then raise exception 'banned'; end if;
    if not public.is_admin() then new.blocked := false; end if;
    if (select count(*) from public.listings where owner = auth.uid()) >= 10 then
      raise exception 'limit: максимум 10 объявлений';
    end if;
  else
    new.id := old.id; new.owner := old.owner; new.created_at := old.created_at;
    if not public.is_admin() then new.blocked := old.blocked; end if;
  end if;
  new.updated_at := now();
  return new;
end
$$;

-- ---------- чаты ----------
create table if not exists public.chats (
  id             uuid primary key default gen_random_uuid(),
  listing_id     text references public.listings(id) on delete set null,
  listing_title  text not null default '',
  client         uuid not null default auth.uid() references auth.users(id) on delete cascade,
  master         uuid not null references auth.users(id) on delete cascade,
  client_name    text not null default '' check (char_length(client_name) <= 60),
  created_at     timestamptz not null default now(),
  last_at        timestamptz not null default now(),
  last_text      text not null default '',
  last_sender    uuid,
  client_read_at timestamptz not null default now(),
  master_read_at timestamptz not null default 'epoch',
  master_notified_at timestamptz,
  client_notified_at timestamptz,
  unique (listing_id, client)
);
create index if not exists chats_client_idx on public.chats(client, last_at desc);
create index if not exists chats_master_idx on public.chats(master, last_at desc);

create or replace function public.chats_guard() returns trigger
language plpgsql security definer set search_path = public as
$$
declare l record;
begin
  new.client := auth.uid();
  if public.is_banned(auth.uid()) then raise exception 'banned'; end if;
  select owner, name, profession into l from public.listings where id = new.listing_id and active and not blocked;
  if l.owner is null then raise exception 'listing not found'; end if;
  if l.owner = new.client then raise exception 'own listing'; end if;
  new.master := l.owner;
  new.listing_title := l.name || ' · ' || l.profession;
  new.client_name := left(trim(coalesce(new.client_name, '')), 60);
  new.created_at := now(); new.last_at := now(); new.last_text := ''; new.last_sender := null;
  new.client_read_at := now(); new.master_read_at := 'epoch';
  if (select count(*) from public.chats where client = new.client and created_at > now() - interval '1 day') >= 30 then
    raise exception 'slow down';
  end if;
  return new;
end
$$;
drop trigger if exists chats_guard on public.chats;
create trigger chats_guard before insert on public.chats for each row execute function public.chats_guard();

alter table public.chats enable row level security;
drop policy if exists "chats read" on public.chats;
drop policy if exists "chats create" on public.chats;
create policy "chats read" on public.chats for select
  using (client = auth.uid() or master = auth.uid() or public.is_admin());
create policy "chats create" on public.chats for insert to authenticated
  with check (client = auth.uid());
grant select, insert on public.chats to authenticated;

-- ---------- сообщения ----------
create table if not exists public.messages (
  id         bigint generated always as identity primary key,
  chat_id    uuid not null references public.chats(id) on delete cascade,
  sender     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  body       text not null default '' check (char_length(body) <= 2000),
  photo      text not null default '' check (char_length(photo) <= 400),
  created_at timestamptz not null default now(),
  check (body <> '' or photo <> '')
);
create index if not exists messages_chat_idx on public.messages(chat_id, id);

create or replace function public.messages_guard() returns trigger
language plpgsql security definer set search_path = public as
$$
begin
  new.sender := auth.uid();
  new.created_at := now();
  if public.is_banned(auth.uid()) then raise exception 'banned'; end if;
  if not exists (select 1 from public.chats c where c.id = new.chat_id and (c.client = auth.uid() or c.master = auth.uid())) then
    raise exception 'not your chat';
  end if;
  if (select count(*) from public.messages where sender = auth.uid() and created_at > now() - interval '1 minute') >= 20 then
    raise exception 'slow down';
  end if;
  return new;
end
$$;
drop trigger if exists messages_guard on public.messages;
create trigger messages_guard before insert on public.messages for each row execute function public.messages_guard();

create or replace function public.messages_after() returns trigger
language plpgsql security definer set search_path = public as
$$
begin
  update public.chats set
    last_at = new.created_at,
    last_text = left(case when new.body <> '' then new.body else '📷' end, 140),
    last_sender = new.sender,
    client_read_at = case when client = new.sender then new.created_at else client_read_at end,
    master_read_at = case when master = new.sender then new.created_at else master_read_at end
  where id = new.chat_id;
  return null;
end
$$;
drop trigger if exists messages_after on public.messages;
create trigger messages_after after insert on public.messages for each row execute function public.messages_after();

alter table public.messages enable row level security;
drop policy if exists "messages read" on public.messages;
drop policy if exists "messages send" on public.messages;
create policy "messages read" on public.messages for select
  using (exists (select 1 from public.chats c where c.id = chat_id and (c.client = auth.uid() or c.master = auth.uid())) or public.is_admin());
create policy "messages send" on public.messages for insert to authenticated
  with check (sender = auth.uid());
grant select, insert on public.messages to authenticated;

-- отметить чат прочитанным
create or replace function public.mark_read(p_chat uuid) returns void
language sql security definer set search_path = public as
$$
  update public.chats set
    client_read_at = case when client = auth.uid() then now() else client_read_at end,
    master_read_at = case when master = auth.uid() then now() else master_read_at end
  where id = p_chat and (client = auth.uid() or master = auth.uid());
$$;
grant execute on function public.mark_read(uuid) to authenticated;

-- ---------- жалобы ----------
create table if not exists public.reports (
  id         bigint generated always as identity primary key,
  chat_id    uuid references public.chats(id) on delete cascade,
  reporter   uuid not null default auth.uid() references auth.users(id) on delete cascade,
  reason     text not null default '' check (char_length(reason) <= 1000),
  resolved   boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.reports enable row level security;
drop policy if exists "reports create" on public.reports;
drop policy if exists "reports admin read" on public.reports;
drop policy if exists "reports admin update" on public.reports;
create policy "reports create" on public.reports for insert to authenticated
  with check (reporter = auth.uid() and exists (select 1 from public.chats c where c.id = chat_id and (c.client = auth.uid() or c.master = auth.uid())));
create policy "reports admin read" on public.reports for select using (public.is_admin());
create policy "reports admin update" on public.reports for update using (public.is_admin());
grant select, insert, update on public.reports to authenticated;

-- ---------- сообщения приходят сразу, без обновления страницы ----------
do $$
begin
  begin alter publication supabase_realtime add table public.messages; exception when others then null; end;
  begin alter publication supabase_realtime add table public.chats; exception when others then null; end;
end $$;
