-- ============================================
-- 0001: ORGANIZATIONS (Tenant Table)
-- ============================================

create extension if not exists "pgcrypto";

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  domain text unique,
  logo_url text,
  favicon_url text,
  theme_primary_color text not null default '#0f172a',
  theme_secondary_color text not null default '#64748b',
  social_instagram text,
  social_facebook text,
  social_youtube text,
  social_whatsapp text,
  address text,
  phone text,
  email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_organizations_slug on public.organizations (slug);
create index if not exists idx_organizations_domain on public.organizations (domain);
create index if not exists idx_organizations_deleted_at on public.organizations (deleted_at);

-- Auto update updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_organizations_updated_at
before update on public.organizations
for each row
execute function public.set_updated_at();