-- ============================================
-- 0009: ATTENDANCE (Absensi)
-- attendance_sessions = 1 kali pertemuan (kelas + tanggal)
-- attendance_records  = status tiap siswa di pertemuan tsb
-- ============================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'attendance_status') then
    create type public.attendance_status as enum ('hadir', 'izin', 'sakit', 'alpha');
  end if;
end$$;

create table if not exists public.attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  session_date date not null,
  notes text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (class_id, session_date)
);

create index if not exists idx_attendance_sessions_organization_id on public.attendance_sessions (organization_id);
create index if not exists idx_attendance_sessions_class_id on public.attendance_sessions (class_id);
create index if not exists idx_attendance_sessions_date on public.attendance_sessions (session_date);
create index if not exists idx_attendance_sessions_deleted_at on public.attendance_sessions (deleted_at);

create trigger trg_attendance_sessions_updated_at
before update on public.attendance_sessions
for each row
execute function public.set_updated_at();

create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  session_id uuid not null references public.attendance_sessions (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  status public.attendance_status not null default 'hadir',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (session_id, student_id)
);

create index if not exists idx_attendance_records_organization_id on public.attendance_records (organization_id);
create index if not exists idx_attendance_records_session_id on public.attendance_records (session_id);
create index if not exists idx_attendance_records_student_id on public.attendance_records (student_id);
create index if not exists idx_attendance_records_deleted_at on public.attendance_records (deleted_at);

create trigger trg_attendance_records_updated_at
before update on public.attendance_records
for each row
execute function public.set_updated_at();

-- Helper: Owner/Admin/Guru boleh kelola absensi (Finance tidak)
create or replace function public.can_manage_attendance()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('owner', 'admin', 'guru')
  );
$$;

alter table public.attendance_sessions enable row level security;
alter table public.attendance_records enable row level security;

create policy "attendance_sessions_select_same_org"
on public.attendance_sessions for select
using (organization_id = public.get_my_organization_id());

create policy "attendance_sessions_insert_managers"
on public.attendance_sessions for insert
with check (organization_id = public.get_my_organization_id() and public.can_manage_attendance());

create policy "attendance_sessions_update_managers"
on public.attendance_sessions for update
using (organization_id = public.get_my_organization_id() and public.can_manage_attendance())
with check (organization_id = public.get_my_organization_id() and public.can_manage_attendance());

create policy "attendance_records_select_same_org"
on public.attendance_records for select
using (organization_id = public.get_my_organization_id());

create policy "attendance_records_insert_managers"
on public.attendance_records for insert
with check (organization_id = public.get_my_organization_id() and public.can_manage_attendance());

create policy "attendance_records_update_managers"
on public.attendance_records for update
using (organization_id = public.get_my_organization_id() and public.can_manage_attendance())
with check (organization_id = public.get_my_organization_id() and public.can_manage_attendance());