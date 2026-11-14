-- MultiHelp — база данных для личных кабинетов мастеров (Supabase).
-- Как установить: Supabase → SQL Editor → New query → вставить весь этот текст → Run.
-- В самом конце замените ВАШ_EMAIL на свою почту — так вы станете администратором
-- (сможете скрывать чужие объявления). Повторный запуск ничего не ломает.

-- ---------- объявления ----------
create table if not exists public.listings (
  id            text primary key default substr(md5(random()::text || clock_timestamp()::text), 1, 8),
  owner         uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name          text not null check (char_length(name) between 2 and 80),
  profession    text not null check (char_length(profession) between 2 and 80),
  category      text not null default 'other',
  city          text not null check (char_length(city) between 2 and 60),
  area          text default '' check (char_length(area) <= 200),
  languages     text default '' check (char_length(languages) <= 120),
  about         text default '' check (char_length(about) <= 2000),
  services      text default '' check (char_length(services) <= 2000),
  price_from    numeric check (price_from is null or (price_from >= 0 and price_from < 1000000)),
  experience    int check (experience is null or (experience >= 0 and experience < 80)),
  urgent        boolean not null default false,
  available_today boolean not null default false,
  whatsapp      text default '' check (char_length(whatsapp) <= 30),
  phone         text default '' check (char_length(phone) <= 30),
  social        text default '' check (char_length(social) <= 600),
  video_links   text default '' check (char_length(video_links) <= 1000),
  avatar        text default '' check (char_length(avatar) <= 400),
  photos        text[] not null default '{}' check (cardinality(photos) <= 12),
  active        boolean not null default true,   -- мастер сам скрыл / показал
  blocked       boolean not null default false,  -- скрыто администратором
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists listings_owner_idx on public.listings(owner);

-- ---------- администраторы ----------
create table if not exists public.admins (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.admins enable row level security;
drop policy if exists "admins see self" on public.admins;
create policy "admins see self" on public.admins for select using (user_id = auth.uid());

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- защита: мастер не может снять блокировку, сменить владельца; не больше 10 объявлений ----------
create or replace function public.listings_guard() returns trigger
language plpgsql security definer set search_path = public as
$$
begin
  if tg_op = 'INSERT' then
    new.owner := auth.uid();
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
drop trigger if exists listings_guard on public.listings;
create trigger listings_guard before insert or update on public.listings
  for each row execute function public.listings_guard();

-- ---------- кто что видит и меняет ----------
alter table public.listings enable row level security;
drop policy if exists "public read" on public.listings;
drop policy if exists "owner insert" on public.listings;
drop policy if exists "owner update" on public.listings;
drop policy if exists "owner delete" on public.listings;
create policy "public read" on public.listings for select
  using ((active and not blocked) or owner = auth.uid() or public.is_admin());
create policy "owner insert" on public.listings for insert to authenticated
  with check (owner = auth.uid());
create policy "owner update" on public.listings for update to authenticated
  using (owner = auth.uid() or public.is_admin());
create policy "owner delete" on public.listings for delete to authenticated
  using (owner = auth.uid() or public.is_admin());
grant select on public.listings to anon, authenticated;
grant insert, update, delete on public.listings to authenticated;

-- ---------- фото: публичная папка, каждый пишет только в свою подпапку ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 3145728, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 3145728, allowed_mime_types = array['image/jpeg','image/png','image/webp'];
drop policy if exists "photos read" on storage.objects;
drop policy if exists "photos upload own" on storage.objects;
drop policy if exists "photos delete own" on storage.objects;
create policy "photos read" on storage.objects for select using (bucket_id = 'photos');
create policy "photos upload own" on storage.objects for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "photos delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'photos' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

-- ---------- администратор ----------
-- Сначала один раз войдите на сайте в личный кабинет со своей почты, потом выполните эту строку
-- (замените ВАШ_EMAIL на свою почту):
-- insert into public.admins select id from auth.users where email = 'ВАШ_EMAIL' on conflict do nothing;
