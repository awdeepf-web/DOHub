-- ============================================
-- 0013: LANDING_SECTIONS (Blok konten Landing Page CMS)
-- ============================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'landing_section_type') then
    create type public.landing_section_type as enum ('hero', 'about', 'features', 'cta', 'contact', 'custom');
  end if;
end$$;

create table if not exists public.landing_sections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_type public.landing_section_type not null default 'custom',
  heading text not null,
  subheading text,
  body text,
  image_url text,
  order_index integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_landing_sections_organization_id on public.landing_sections (organization_id);
create index if not exists idx_landing_sections_order on public.landing_sections (order_index);
create index if not exists idx_landing_sections_deleted_at on public.landing_sections (deleted_at);

create trigger trg_landing_sections_updated_at
before update on public.landing_sections
for each row
execute function public.set_updated_at();

alter table public.landing_sections enable row level security;

-- Publik boleh lihat blok yang visible (untuk landing page)
create policy "landing_sections_select_public"
on public.landing_sections for select
using (deleted_at is null and is_visible = true);

-- Member organisasi (login) boleh lihat SEMUA blok miliknya (termasuk yang disembunyikan, untuk dashboard CMS)
create policy "landing_sections_select_own_org"
on public.landing_sections for select
using (organization_id = public.get_my_organization_id());

-- Hanya Owner/Admin boleh kelola
create policy "landing_sections_insert_admin"
on public.landing_sections for insert
with check (organization_id = public.get_my_organization_id() and public.is_admin_or_owner());

create policy "landing_sections_update_admin"
on public.landing_sections for update
using (organization_id = public.get_my_organization_id() and public.is_admin_or_owner())
with check (organization_id = public.get_my_organization_id() and public.is_admin_or_owner());

create policy "landing_sections_delete_admin"
on public.landing_sections for delete
using (organization_id = public.get_my_organization_id() and public.is_admin_or_owner());