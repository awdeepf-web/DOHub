import type { TypedSupabaseClient } from '@/types/supabase';
import type { Organization } from '@/types/database.types';
import { BaseRepository } from '@/repositories/base.repository';

export class OrganizationRepository extends BaseRepository<Organization> {
  constructor(supabase: TypedSupabaseClient) {
    super(supabase, 'organizations');
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    const { data, error } = await this.supabase
      .from('organizations')
      .select('*')
      .eq('slug', slug)
      .is('deleted_at', null)
      .maybeSingle();

    this.handleError('findBySlug', error);
    return data;
  }

  async create(input: {
    name: string;
    slug: string;
    email?: string;
  }): Promise<Organization> {
    const { data, error } = await this.supabase
      .from('organizations')
      .insert({ name: input.name, slug: input.slug, email: input.email ?? null })
      .select('*')
      .single();

    this.handleError('create', error);
    if (!data) {
      throw new Error('[organizations] create: no data returned');
    }
    return data;
  }

  async update(id: string, input: Partial<Organization>): Promise<Organization> {
    const { data, error } = await this.supabase
      .from('organizations')
      .update(input)
      .eq('id', id)
      .select('*')
      .single();

    this.handleError('update', error);
    if (!data) {
      throw new Error('[organizations] update: no data returned');
    }
    return data;
  }
}