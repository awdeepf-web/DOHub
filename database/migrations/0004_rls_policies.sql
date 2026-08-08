-- ============================================
-- 0004: ROW LEVEL SECURITY
-- ============================================

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;

-- ORGANIZATIONS: hanya bisa lihat org sendiri
create policy "org_select_own"
on public.organizations for select
using (id = public.get_my_organization_id());

-- ORGANIZATIONS: hanya owner/admin boleh update org sendiri
create policy "org_update_owner_admin"
on public.organizations for update
using (id = public.get_my_organization_id() and public.is_admin_or_owner())
with check (id = public.get_my_organization_id() and public.is_admin_or_owner());

-- PROFILES: user bisa lihat semua profile di org yang sama
create policy "profiles_select_same_org"
on public.profiles for select
using (organization_id = public.get_my_organization_id());

-- PROFILES: user boleh update profile miliknya sendiri (data pribadi)
create policy "profiles_update_self"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

-- PROFILES: owner/admin boleh update profile siapa saja di org yang sama (misal ganti role)
create policy "profiles_update_admin"
on public.profiles for update
using (organization_id = public.get_my_organization_id() and public.is_admin_or_owner())
with check (organization_id = public.get_my_organization_id() and public.is_admin_or_owner());

-- PROFILES: hanya owner/admin boleh insert user baru secara manual
create policy "profiles_insert_admin"
on public.profiles for insert
with check (public.is_admin_or_owner() or auth.uid() = id);

-- PROFILES: hanya owner boleh soft-delete (nonaktifkan) user
create policy "profiles_delete_owner"
on public.profiles for delete
using (organization_id = public.get_my_organization_id() and public.get_my_role() = 'owner');