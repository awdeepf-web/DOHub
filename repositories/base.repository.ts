/**
 * Base Repository — semua repository turunan pakai class ini
 * supaya cara akses data konsisten (Repository Pattern).
 * TClient dibuat generic (bukan tipe tetap) supaya repository yang sama
 * bisa dipakai baik oleh client biasa (createClient) maupun admin client
 * (createAdminClient) tanpa bentrok tipe antar versi package Supabase.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseRepository<TRow, TClient = any> {
  protected constructor(
    protected readonly supabase: TClient,
    protected readonly tableName: string,
  ) {}

  protected handleError(context: string, error: { message: string } | null): void {
    if (error) {
      throw new Error(`[${this.tableName}] ${context}: ${error.message}`);
    }
  }

  async findById(id: string): Promise<TRow | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = this.supabase as any;
    const { data, error } = await client
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle();

    this.handleError('findById', error);
    return data as TRow | null;
  }
}