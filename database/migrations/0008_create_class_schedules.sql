-- ============================================
-- 0008: CLASS_SCHEDULES (Jadwal Kelas Mingguan)
-- ============================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'day_of_week') then
    create type public.day_of_week as enum (
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'schedule_status') then
    create type public.schedule_status as enum ('active', 'inactive');
  end if;
end$$;

create table if not exists public.class_schedules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  day_of_week public.day_of_week not null,
  start_time time not null,
  end_time time not null,
  room text,
  status public.schedule_status not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint check_end_after_start check (end_time > start_time)
);

create index if not exists idx_class_schedules_organization_id on public.class_schedules (organization_id);
create index if not exists idx_class_schedules_class_id on public.class_schedules (class_id);
create index if not exists idx_class_schedules_day on public.class_schedules (day_of_week);
create index if not exists idx_class_schedules_deleted_at on public.class_schedules (deleted_at);

create trigger trg_class_schedules_updated_at
before update on public.class_schedules
for each row
execute function public.set_updated_at();

alter table public.class_schedules enable row level security;

-- Semua role boleh lihat jadwal
create policy "class_schedules_select_same_org"
on public.class_schedules for select
using (organization_id = public.get_my_organization_id());

-- Hanya Owner/Admin boleh kelola jadwal
create policy "class_schedules_insert_admin"
on public.class_schedules for insert
with check (organization_id = public.get_my_organization_id() and public.is_admin_or_owner());

create policy "class_schedules_update_admin"
on public.class_schedules for update
using (organization_id = public.get_my_organization_id() and public.is_admin_or_owner())
with check (organization_id = public.get_my_organization_id() and public.is_admin_or_owner());

create policy "class_schedules_delete_admin"
on public.class_schedules for delete
using (organization_id = public.get_my_organization_id() and public.is_admin_or_owner());