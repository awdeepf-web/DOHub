-- ============================================
-- 0002: PROFILES (Extends auth.users) + ROLE ENUM
-- ============================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('owner', 'admin', 'guru', 'finance');
  end if;
end$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  avatar_url text,
  role public.user_role not null default 'guru',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_profiles_organization_id on public.profiles (organization_id);
create index if not exists idx_profiles_role on public.profiles (role);
create index if not exists idx_profiles_deleted_at on public.profiles (deleted_at);

create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- Auto-create profile saat user baru register (dari auth.users)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, organization_id, full_name, email, role)
  values (
    new.id,
    (new.raw_user_meta_data->>'organization_id')::uuid,
    coalesce(new.raw_user_meta_data->>'full_name', 'User Baru'),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'guru')
  );
  return new;
end;
$$;

drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();