-- ============================================
-- 0015: Plan Tiering (Free vs Pro) untuk Organizations
-- ============================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'plan_type') then
    create type public.plan_type as enum ('free', 'pro');
  end if;
end$$;

alter table public.organizations
  add column if not exists plan_type public.plan_type not null default 'free',
  add column if not exists custom_domain text,
  add column if not exists meta_pixel_id text,
  add column if not exists google_analytics_id text;

create index if not exists idx_organizations_plan_type on public.organizations (plan_type);