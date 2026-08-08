import { notFound, redirect } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { scheduleService } from '@/services/schedule.service';
import { createClient } from '@/services/supabase/server';
import { ClassRepository } from '@/repositories/class.repository';
import { ScheduleForm } from '@/features/jadwal/components/schedule-form';
import { updateScheduleAction } from '@/features/jadwal/jadwal.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function EditJadwalPage({ params }: { params: { id: string } }) {
  const profile = await requireProfile();
  if (!hasPermission(profile.role, 'schedule:manage')) {
    redirect('/dashboard/jadwal');
  }

  const schedule = await scheduleService.getById(params.id);
  if (!schedule || schedule.organization_id !== profile.organization_id) {
    notFound();
  }

  const supabase = createClient();
  const classRepository = new ClassRepository(supabase);
  const { data: classes } = await classRepository.list({
    organizationId: profile.organization_id,
    pageSize: 100,
  });
  const classOptions = classes.map((klass) => ({ id: klass.id, name: klass.name }));

  const boundAction = updateScheduleAction.bind(null, schedule.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Jadwal Kelas</CardTitle>
      </CardHeader>
      <CardContent>
        <ScheduleForm schedule={schedule} classOptions={classOptions} action={boundAction} />
      </CardContent>
    </Card>
  );
}