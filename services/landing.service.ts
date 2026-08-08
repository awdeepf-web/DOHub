import { createClient } from '@/services/supabase/server';
import { LandingSectionRepository } from '@/repositories/landing-section.repository';
import { OrganizationRepository } from '@/repositories/organization.repository';
import type { SectionInput } from '@/features/landing/landing.validation';
import type { LandingSection, Organization } from '@/types/database.types';

function toNullable(value: string | undefined): string | null {
  return value && value.trim().length > 0 ? value.trim() : null;
}

export class LandingService {
  async listForDashboard(organizationId: string): Promise<LandingSection[]> {
    const supabase = createClient();
    const repository = new LandingSectionRepository(supabase);
    return repository.listByOrganization(organizationId);
  }

  async getById(id: string): Promise<LandingSection | null> {
    const supabase = createClient();
    const repository = new LandingSectionRepository(supabase);
    return repository.findById(id);
  }

  async create(organizationId: string, input: SectionInput): Promise<{ error: string | null }> {
    const supabase = createClient();
    const repository = new LandingSectionRepository(supabase);

    try {
      const maxOrder = await repository.getMaxOrderIndex(organizationId);
      await repository.create({
        organization_id: organizationId,
        section_type: input.sectionType,
        heading: input.heading,
        subheading: toNullable(input.subheading),
        body: toNullable(input.body),
        image_url: toNullable(input.imageUrl),
        order_index: maxOrder + 1,
        is_visible: input.isVisible === 'true',
      });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal menyimpan konten' };
    }
  }

  async update(id: string, input: SectionInput): Promise<{ error: string | null }> {
    const supabase = createClient();
    const repository = new LandingSectionRepository(supabase);

    try {
      await repository.update(id, {
        section_type: input.sectionType,
        heading: input.heading,
        subheading: toNullable(input.subheading),
        body: toNullable(input.body),
        image_url: toNullable(input.imageUrl),
        is_visible: input.isVisible === 'true',
      });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal memperbarui konten' };
    }
  }

  async remove(id: string): Promise<{ error: string | null }> {
    const supabase = createClient();
    const repository = new LandingSectionRepository(supabase);
    try {
      await repository.softDelete(id);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal menghapus konten' };
    }
  }

  async moveUp(organizationId: string, id: string): Promise<{ error: string | null }> {
    return this.swapOrder(organizationId, id, 'up');
  }

  async moveDown(organizationId: string, id: string): Promise<{ error: string | null }> {
    return this.swapOrder(organizationId, id, 'down');
  }

  private async swapOrder(
    organizationId: string,
    id: string,
    direction: 'up' | 'down',
  ): Promise<{ error: string | null }> {
    const supabase = createClient();
    const repository = new LandingSectionRepository(supabase);

    try {
      const sections = await repository.listByOrganization(organizationId);
      const index = sections.findIndex((section) => section.id === id);
      if (index === -1) {
        return { error: 'Konten tidak ditemukan' };
      }

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= sections.length) {
        return { error: null }; // sudah di posisi paling atas/bawah, tidak ada aksi
      }

      const current = sections[index];
      const target = sections[targetIndex];

      // Pengecekan tipe agar TypeScript yakin nilainya tidak undefined
      if (!current || !target) {
        return { error: 'Konten tidak ditemukan' };
      }

      await repository.update(current.id, { order_index: target.order_index });
      await repository.update(target.id, { order_index: current.order_index });

      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal mengubah urutan' };
    }
  }

  /**
   * Dipakai oleh halaman publik landing page — akses PUBLIK, jadi
   * memakai client biasa (RLS sudah menangani pembatasan ke baris visible saja).
   */
  async getPublicLandingData(
    slug: string,
  ): Promise<{ organization: Organization; sections: LandingSection[] } | null> {
    const supabase = createClient();
    const orgRepository = new OrganizationRepository(supabase);
    const sectionRepository = new LandingSectionRepository(supabase);

    const organization = await orgRepository.findBySlug(slug);
    if (!organization) return null;

    const sections = await sectionRepository.listVisibleByOrganization(organization.id);

    return { organization, sections };
  }
}

export const landingService = new LandingService();