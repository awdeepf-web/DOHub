-- ============================================
-- 0014: Storage Bucket untuk Logo/Favicon Bimbel
-- ============================================

insert into storage.buckets (id, name, public)
values ('branding', 'branding', true)
on conflict (id) do nothing;

-- Publik boleh LIHAT semua file di bucket ini (supaya logo tampil di landing page)
create policy "branding_select_public"
on storage.objects for select
using (bucket_id = 'branding');

-- Hanya Owner/Admin boleh UPLOAD, dan hanya ke folder organisasinya sendiri
-- (path file harus diawali {organization_id}/... )
create policy "branding_insert_admin"
on storage.objects for insert
with check (
  bucket_id = 'branding'
  and (storage.foldername(name))[1] = public.get_my_organization_id()::text
  and public.is_admin_or_owner()
);

create policy "branding_update_admin"
on storage.objects for update
using (
  bucket_id = 'branding'
  and (storage.foldername(name))[1] = public.get_my_organization_id()::text
  and public.is_admin_or_owner()
)
with check (
  bucket_id = 'branding'
  and (storage.foldername(name))[1] = public.get_my_organization_id()::text
  and public.is_admin_or_owner()
);

create policy "branding_delete_admin"
on storage.objects for delete
using (
  bucket_id = 'branding'
  and (storage.foldername(name))[1] = public.get_my_organization_id()::text
  and public.is_admin_or_owner()
);