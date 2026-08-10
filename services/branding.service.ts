import { createClient } from '@/services/supabase/server';
import { OrganizationRepository } from '@/repositories/organization.repository';
import { canUseCustomDomain, canUseAnalytics } from '@/utils/plan-limits';
import type { BrandingInput } from '@/features/branding/branding.validation';
import type { Organization } from '@/types/database.types';

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

function toNullable(value: string | undefined): string | null {
  return value && value.trim().length > 0 ? value.trim() : null;
}

function getFileExtension(fileName: string): string {
  const ext = fileName.split('.').pop();
  return ext ? ext.toLowerCase() : 'png';
}

export class BrandingService {
  async update(organizationId: string, input: BrandingInput): Promise<{ error: string | null }> {
    const supabase = createClient();
    const orgRepository = new OrganizationRepository(supabase);

    const existing = await orgRepository.findById(organizationId);
    if (!existing) {
      return { error: 'Organisasi tidak ditemukan' };
    }

    // Pertahanan sisi server: field Pro tetap diabaikan meski form berhasil
    // dikirim (misal user Free mengakali UI), memastikan gating konsisten.
    const isPro = existing.plan_type === 'pro';

    try {
      await orgRepository.update(organizationId, {
        name: input.name,
        domain: toNullable(input.domain),
        theme_primary_color: input.themePrimaryColor,
        theme_secondary_color: input.themeSecondaryColor,
        social_instagram: toNullable(input.socialInstagram),
        social_facebook: toNullable(input.socialFacebook),
        social_youtube: toNullable(input.socialYoutube),
        social_whatsapp: toNullable(input.socialWhatsapp),
        address: toNullable(input.address),
        phone: toNullable(input.phone),
        email: toNullable(input.email),
        custom_domain: isPro && canUseCustomDomain(existing.plan_type) ? toNullable(input.customDomain) : existing.custom_domain,
        meta_pixel_id: isPro && canUseAnalytics(existing.plan_type) ? toNullable(input.metaPixelId) : existing.meta_pixel_id,
        google_analytics_id: isPro && canUseAnalytics(existing.plan_type) ? toNullable(input.googleAnalyticsId) : existing.google_analytics_id,
      });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal menyimpan branding' };
    }
  }

  async uploadLogo(
    organizationId: string,
    file: File,
  ): Promise<{ error: string | null; logoUrl: string | null }> {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { error: 'Format file harus PNG, JPG, WEBP, atau SVG', logoUrl: null };
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return { error: 'Ukuran file maksimal 2MB', logoUrl: null };
    }

    const supabase = createClient();
    const orgRepository = new OrganizationRepository(supabase);

    const extension = getFileExtension(file.name);
    const path = `${organizationId}/logo-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage.from('branding').upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

    if (uploadError) {
      return { error: uploadError.message, logoUrl: null };
    }

    const { data: publicUrlData } = supabase.storage.from('branding').getPublicUrl(path);
    const logoUrl = publicUrlData.publicUrl;

    try {
      await orgRepository.update(organizationId, { logo_url: logoUrl });
      return { error: null, logoUrl };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Gagal menyimpan URL logo',
        logoUrl: null,
      };
    }
  }

  async uploadFavicon(
    organizationId: string,
    file: File,
  ): Promise<{ error: string | null; faviconUrl: string | null }> {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { error: 'Format file harus PNG, JPG, WEBP, atau SVG', faviconUrl: null };
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return { error: 'Ukuran file maksimal 2MB', faviconUrl: null };
    }

    const supabase = createClient();
    const orgRepository = new OrganizationRepository(supabase);

    const extension = getFileExtension(file.name);
    const path = `${organizationId}/favicon-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage.from('branding').upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

    if (uploadError) {
      return { error: uploadError.message, faviconUrl: null };
    }

    const { data: publicUrlData } = supabase.storage.from('branding').getPublicUrl(path);
    const faviconUrl = publicUrlData.publicUrl;

    try {
      await orgRepository.update(organizationId, { favicon_url: faviconUrl });
      return { error: null, faviconUrl };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Gagal menyimpan URL favicon',
        faviconUrl: null,
      };
    }
  }

  async getById(organizationId: string): Promise<Organization | null> {
    const supabase = createClient();
    const orgRepository = new OrganizationRepository(supabase);
    return orgRepository.findById(organizationId);
  }
}

export const brandingService = new BrandingService();