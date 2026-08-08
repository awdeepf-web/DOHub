-- ============================================
-- 0010: PAYMENTS (Pembayaran)
-- ============================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'payment_category') then
    create type public.payment_category as enum ('registration', 'monthly_fee', 'other');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_method') then
    create type public.payment_method as enum ('cash', 'transfer', 'other');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type public.payment_status as enum ('paid', 'pending', 'cancelled');
  end if;
end$$;

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  category public.payment_category not null default 'monthly_fee',
  period text,
  amount numeric(12,2) not null,
  payment_date date not null,
  method public.payment_method not null default 'cash',
  status public.payment_status not null default 'paid',
  notes text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint check_amount_positive check (amount > 0)
);

create index if not exists idx_payments_organization_id on public.payments (organization_id);
create index if not exists idx_payments_student_id on public.payments (student_id);
create index if not exists idx_payments_payment_date on public.payments (payment_date);
create index if not exists idx_payments_status on public.payments (status);
create index if not exists idx_payments_deleted_at on public.payments (deleted_at);

create trigger trg_payments_updated_at
before update on public.payments
for each row
execute function public.set_updated_at();

-- Helper: Owner/Admin/Finance boleh kelola pembayaran
create or replace function public.can_manage_payment()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('owner', 'admin', 'finance')
  );
$$;

alter table public.payments enable row level security;

create policy "payments_select_same_org"
on public.payments for select
using (organization_id = public.get_my_organization_id());

create policy "payments_insert_managers"
on public.payments for insert
with check (organization_id = public.get_my_organization_id() and public.can_manage_payment());

create policy "payments_update_managers"
on public.payments for update
using (organization_id = public.get_my_organization_id() and public.can_manage_payment())
with check (organization_id = public.get_my_organization_id() and public.can_manage_payment());

create policy "payments_delete_managers"
on public.payments for delete
using (organization_id = public.get_my_organization_id() and public.can_manage_payment());