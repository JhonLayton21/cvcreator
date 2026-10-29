create table if not exists public.cvs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'CV sin título',
  template text,
  content jsonb not null default '{}'::jsonb,
  thumbnail_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cvs_user_id_updated_idx
  on public.cvs (user_id, updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cvs_set_updated_at on public.cvs;
create trigger cvs_set_updated_at
  before update on public.cvs
  for each row execute function public.set_updated_at();

alter table public.cvs enable row level security;

drop policy if exists "cvs_select_own" on public.cvs;
create policy "cvs_select_own" on public.cvs
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "cvs_insert_own" on public.cvs;
create policy "cvs_insert_own" on public.cvs
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "cvs_update_own" on public.cvs;
create policy "cvs_update_own" on public.cvs
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "cvs_delete_own" on public.cvs;
create policy "cvs_delete_own" on public.cvs
  for delete to authenticated
  using (auth.uid() = user_id);

revoke all on public.cvs from anon;
grant select, insert, update, delete on public.cvs to authenticated;
