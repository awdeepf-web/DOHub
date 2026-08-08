import type { TypedSupabaseClient } from '@/types/supabase';
import type { Profile } from '@/types/database.types';
import { BaseRepository } from '@/repositories/base.repository';

export class ProfileRepository extends BaseRepository<Profile> {
  constructor(supabase: TypedSupabaseClient) {
    super(supabase, 'profiles');
  }

  async findByOrganization(organizationId: string): Promise<Profile[]> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('created_at', { ascending: true });

    this.handleError('findByOrganization', error);
    return data ?? [];
  }

  async findByIds(ids: string[]): Promise<Profile[]> {
    if (ids.length === 0) return [];

    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .in('id', ids)
      .is('deleted_at', null);

    this.handleError('findByIds', error);
    return data ?? [];
  }

  async updateRole(id: string, role: Profile['role']): Promise<Profile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update({ role })
      .eq('id', id)
      .select('*')
      .single();

    this.handleError('updateRole', error);
    if (!data) {
      throw new Error('[profiles] updateRole: no data returned');
    }
    return data;
  }

  async update(id: string, input: Partial<Profile>): Promise<Profile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(input)
      .eq('id', id)
      .select('*')
      .single();

    this.handleError('update', error);
    if (!data) {
      throw new Error('[profiles] update: no data returned');
    }
    return data;
  }
}