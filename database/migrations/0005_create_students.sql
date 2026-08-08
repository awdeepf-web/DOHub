-- ============================================
-- 0005: STUDENTS (Siswa)
-- ============================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'gender_type') then
    create type public.gender_type as enum ('L', 'P');
  end if;
  if not exists (select 1 from pg_type where typname = 'student_status') then
    create type public.student_status as enum ('active', 'inactive');
  end if;
end$$;

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  nis text not null,
  full_name text not null,
  gender public.gender_type not null,
  birth_place text,
  birth_date date,
  address text,
  phone text,
  parent_name text,
  parent_phone text,
  school_origin text,
  photo_url text,
  status public.student_status not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (organization_id, nis)
);

create index if not exists idx_students_organization_id on public.students (organization_id);
create index if not exists idx_students_full_name on public.students (full_name);
create index if not exists idx_students_status on public.students (status);
create index if not exists idx_students_deleted_at on public.students (deleted_at);

create trigger trg_students_updated_at
before update on public.students
for each row
execute function public.set_updated_at();

alter table public.students enable row level security;

-- Semua role dalam 1 organization boleh LIHAT data siswa
create policy "students_select_same_org"
on public.students for select
using (organization_id = public.get_my_organization_id());

-- Hanya Owner/Admin boleh tambah, edit, hapus
create policy "students_insert_admin"
on public.students for insert
with check (organization_id = public.get_my_organization_id() and public.is_admin_or_owner());

create policy "students_update_admin"
on public.students for update
using (organization_id = public.get_my_organization_id() and public.is_admin_or_owner())
with check (organization_id = public.get_my_organization_id() and public.is_admin_or_owner());

create policy "students_delete_admin"
on public.students for delete
using (organization_id = public.get_my_organization_id() and public.is_admin_or_owner());