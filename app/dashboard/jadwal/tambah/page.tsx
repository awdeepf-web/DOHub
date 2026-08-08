import { redirect } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { createClient } from '@/services/supabase/server';
import { ClassRepository } from '@/repositories/class.repository';
import { ScheduleForm } from '@/features/jadwal/components/schedule-form';
import { createScheduleAction } from '@/features/jadwal/jadwal.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function TambahJadwalPage() {
  const profile = await requireProfile();
  if (!hasPermission(profile.role, 'schedule:manage')) {
    redirect('/dashboard/jadwal');
  }

  const supabase = createClient();
  const classRepository = new ClassRepository(supabase);
  const { data: classes } = await classRepository.list({
    organizationId: profile.organization_id,
    pageSize: 100,
  });

  const classOptions = classes.map((klass) => ({ id: klass.id, name: klass.name }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Jadwal Kelas</CardTitle>
      </CardHeader>
      <CardContent>
        <ScheduleForm classOptions={classOptions} action={createScheduleAction} />
      </CardContent>
    </Card>
  );
}