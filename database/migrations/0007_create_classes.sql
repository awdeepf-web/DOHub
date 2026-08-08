-- ============================================
-- 0007: CLASSES (Kelas) + CLASS_STUDENTS (Enrollment)
-- ============================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'class_status') then
    create type public.class_status as enum ('active', 'inactive');
  end if;
end$$;

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  teacher_id uuid references public.teachers (id) on delete set null,
  name text not null,
  subject text,
  capacity integer not null default 20,
  status public.class_status not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_classes_organization_id on public.classes (organization_id);
create index if not exists idx_classes_teacher_id on public.classes (teacher_id);
create index if not exists idx_classes_status on public.classes (status);
create index if not exists idx_classes_deleted_at on public.classes (deleted_at);

create trigger trg_classes_updated_at
before update on public.classes
for each row
execute function public.set_updated_at();

-- Tabel penghubung Siswa <-> Kelas (many-to-many)
create table if not exists public.class_students (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (class_id, student_id)
);

create index if not exists idx_class_students_organization_id on public.class_students (organization_id);
create index if not exists idx_class_students_class_id on public.class_students (class_id);
create index if not exists idx_class_students_student_id on public.class_students (student_id);
create index if not exists idx_class_students_deleted_at on public.class_students (deleted_at);

create trigger trg_class_students_updated_at
before update on public.class_students
for each row
execute function public.set_updated_at();

alter table public.classes enable row level security;
alter table public.class_students enable row level security;

-- CLASSES: semua role boleh lihat
create policy "classes_select_same_org"
on public.classes for select
using (organization_id = public.get_my_organization_id());

-- CLASSES: hanya Owner/Admin boleh kelola
create policy "classes_insert_admin"
on public.classes for insert
with check (organization_id = public.get_my_organization_id() and public.is_admin_or_owner());

create policy "classes_update_admin"
on public.classes for update
using (organization_id = public.get_my_organization_id() and public.is_admin_or_owner())
with check (organization_id = public.get_my_organization_id() and public.is_admin_or_owner());

create policy "classes_delete_admin"
on public.classes for delete
using (organization_id = public.get_my_organization_id() and public.is_admin_or_owner());

-- CLASS_STUDENTS: semua role boleh lihat
create policy "class_students_select_same_org"
on public.class_students for select
using (organization_id = public.get_my_organization_id());

-- CLASS_STUDENTS: hanya Owner/Admin boleh kelola
create policy "class_students_insert_admin"
on public.class_students for insert
with check (organization_id = public.get_my_organization_id() and public.is_admin_or_owner());

create policy "class_students_delete_admin"
on public.class_students for delete
using (organization_id = public.get_my_organization_id() and public.is_admin_or_owner());