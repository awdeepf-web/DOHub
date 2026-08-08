-- ============================================
-- 0006: TEACHERS (Guru) — Detail tambahan untuk profile ber-role guru
-- ============================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'teacher_status') then
    create type public.teacher_status as enum ('active', 'inactive');
  end if;
end$$;

create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  subjects text,
  hourly_rate numeric(12,2) not null default 0,
  join_date date,
  bio text,
  status public.teacher_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_teachers_organization_id on public.teachers (organization_id);
create index if not exists idx_teachers_profile_id on public.teachers (profile_id);
create index if not exists idx_teachers_status on public.teachers (status);
create index if not exists idx_teachers_deleted_at on public.teachers (deleted_at);

create trigger trg_teachers_updated_at
before update on public.teachers
for each row
execute function public.set_updated_at();

alter table public.teachers enable row level security;

create policy "teachers_select_same_org"
on public.teachers for select
using (organization_id = public.get_my_organization_id());

create policy "teachers_insert_admin"
on public.teachers for insert
with check (organization_id = public.get_my_organization_id() and public.is_admin_or_owner());

create policy "teachers_update_admin"
on public.teachers for update
using (organization_id = public.get_my_organization_id() and public.is_admin_or_owner())
with check (organization_id = public.get_my_organization_id() and public.is_admin_or_owner());

create policy "teachers_delete_admin"
on public.teachers for delete
using (organization_id = public.get_my_organization_id() and public.is_admin_or_owner());