-- MultiHelp — уведомления о новых сообщениях на телефон (Supabase).
-- Как установить: Supabase → SQL Editor → New query → вставить весь текст → Run.
-- Запускать ПОСЛЕ dev/supabase-chat.sql и после установки функции notify. Повторный запуск ничего не ломает.

create extension if not exists pg_net with schema extensions;

-- телефоны, на которые человек разрешил уведомления
create table if not exists public.push_subs (
  endpoint   text primary key check (char_length(endpoint) <= 1000),
  user_id    uuid not null references auth.users(id) on delete cascade,
  p256dh     text not null check (char_length(p256dh) <= 200),
  auth       text not null check (char_length(auth) <= 100),
  created_at timestamptz not null default now()
);
create index if not exists push_subs_user_idx on public.push_subs(user_id);
alter table public.push_subs enable row level security;
drop policy if exists "push own read" on public.push_subs;
create policy "push own read" on public.push_subs for select using (user_id = auth.uid());

create or replace function public.save_push(p_endpoint text, p_p256dh text, p_auth text) returns void
language sql security definer set search_path = public as
$$
  insert into public.push_subs (endpoint, user_id, p256dh, auth) values (p_endpoint, auth.uid(), p_p256dh, p_auth)
  on conflict (endpoint) do update set user_id = auth.uid(), p256dh = excluded.p256dh, auth = excluded.auth, created_at = now();
$$;
create or replace function public.delete_push(p_endpoint text) returns void
language sql security definer set search_path = public as
$$ delete from public.push_subs where endpoint = p_endpoint and user_id = auth.uid(); $$;
revoke execute on function public.save_push(text, text, text) from anon;
revoke execute on function public.delete_push(text) from anon;
grant execute on function public.save_push(text, text, text) to authenticated;
grant execute on function public.delete_push(text) to authenticated;

-- отметка «уведомление отправлено»
alter table public.messages add column if not exists notified boolean not null default false;

-- после каждого нового сообщения зовём «почтальона»
create or replace function public.messages_notify() returns trigger
language plpgsql security definer set search_path = public, extensions as
$$
begin
  perform net.http_post(
    url := 'https://htljzcwgtsbfgxegbwiu.supabase.co/functions/v1/clever-action',
    body := jsonb_build_object('id', new.id),
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  return null;
exception when others then
  return null; -- уведомление не должно мешать отправке сообщения
end
$$;
drop trigger if exists messages_notify on public.messages;
create trigger messages_notify after insert on public.messages for each row execute function public.messages_notify();
