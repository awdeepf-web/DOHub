-- ============================================
-- 0012: Akses publik terbatas untuk organizations
-- (dibutuhkan supaya landing page bisa dibuka tanpa login)
-- ============================================

create policy "organizations_select_public"
on public.organizations for select
using (is_active = true);