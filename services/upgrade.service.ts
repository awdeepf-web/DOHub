import { createClient } from '@/services/supabase/server';
import { OrganizationRepository } from '@/repositories/organization.repository';
import type { PlanType } from '@/types/database.types';

export class UpgradeService {
  async setPlan(organizationId: string, plan: PlanType): Promise<{ error: string | null }> {
    const supabase = createClient();
    const orgRepository = new OrganizationRepository(supabase);
    try {
      await orgRepository.update(organizationId, { plan_type: plan });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal memperbarui paket' };
    }
  }
}

export const upgradeService = new UpgradeService();