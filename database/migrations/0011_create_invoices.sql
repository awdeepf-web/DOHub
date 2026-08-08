-- ============================================
-- 0011: INVOICES (Tagihan)
-- ============================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'invoice_status') then
    create type public.invoice_status as enum ('unpaid', 'paid', 'overdue', 'cancelled');
  end if;
end$$;

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  payment_id uuid references public.payments (id) on delete set null,
  invoice_number text not null,
  description text not null,
  period text,
  amount numeric(12,2) not null,
  due_date date not null,
  status public.invoice_status not null default 'unpaid',
  paid_at timestamptz,
  notes text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (organization_id, invoice_number),
  constraint check_invoice_amount_positive check (amount > 0)
);

create index if not exists idx_invoices_organization_id on public.invoices (organization_id);
create index if not exists idx_invoices_student_id on public.invoices (student_id);
create index if not exists idx_invoices_status on public.invoices (status);
create index if not exists idx_invoices_due_date on public.invoices (due_date);
create index if not exists idx_invoices_deleted_at on public.invoices (deleted_at);

create trigger trg_invoices_updated_at
before update on public.invoices
for each row
execute function public.set_updated_at();

alter table public.invoices enable row level security;

create policy "invoices_select_same_org"
on public.invoices for select
using (organization_id = public.get_my_organization_id());

create policy "invoices_insert_managers"
on public.invoices for insert
with check (organization_id = public.get_my_organization_id() and public.can_manage_payment());

create policy "invoices_update_managers"
on public.invoices for update
using (organization_id = public.get_my_organization_id() and public.can_manage_payment())
with check (organization_id = public.get_my_organization_id() and public.can_manage_payment());

create policy "invoices_delete_managers"
on public.invoices for delete
using (organization_id = public.get_my_organization_id() and public.can_manage_payment());