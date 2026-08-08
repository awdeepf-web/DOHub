import type { TypedSupabaseClient } from '@/types/supabase';
import type { LandingSection } from '@/types/database.types';
import { BaseRepository } from '@/repositories/base.repository';

export class LandingSectionRepository extends BaseRepository<LandingSection> {
  constructor(supabase: TypedSupabaseClient) {
    super(supabase, 'landing_sections');
  }

  async listByOrganization(organizationId: string): Promise<LandingSection[]> {
    const { data, error } = await this.supabase
      .from('landing_sections')
      .select('*')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('order_index', { ascending: true });

    this.handleError('listByOrganization', error);
    return data ?? [];
  }

  async listVisibleByOrganization(organizationId: string): Promise<LandingSection[]> {
    const { data, error } = await this.supabase
      .from('landing_sections')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_visible', true)
      .is('deleted_at', null)
      .order('order_index', { ascending: true });

    this.handleError('listVisibleByOrganization', error);
    return data ?? [];
  }

  async getMaxOrderIndex(organizationId: string): Promise<number> {
    const sections = await this.listByOrganization(organizationId);
    if (sections.length === 0) return 0;
    return Math.max(...sections.map((section) => section.order_index));
  }

  async create(
    input: Omit<LandingSection, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>,
  ): Promise<LandingSection> {
    const { data, error } = await this.supabase
      .from('landing_sections')
      .insert(input)
      .select('*')
      .single();

    this.handleError('create', error);
    if (!data) {
      throw new Error('[landing_sections] create: no data returned');
    }
    return data;
  }

  async update(id: string, input: Partial<LandingSection>): Promise<LandingSection> {
    const { data, error } = await this.supabase
      .from('landing_sections')
      .update(input)
      .eq('id', id)
      .select('*')
      .single();

    this.handleError('update', error);
    if (!data) {
      throw new Error('[landing_sections] update: no data returned');
    }
    return data;
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('landing_sections')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    this.handleError('softDelete', error);
  }
}