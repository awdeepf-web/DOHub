import { redirect } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { createClient } from '@/services/supabase/server';
import { StudentRepository } from '@/repositories/student.repository';
import { PaymentForm } from '@/features/pembayaran/components/payment-form';
import { createPaymentAction } from '@/features/pembayaran/pembayaran.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function TambahPembayaranPage() {
  const profile = await requireProfile();
  if (!hasPermission(profile.role, 'payment:manage')) {
    redirect('/dashboard/pembayaran');
  }

  const supabase = createClient();
  const studentRepository = new StudentRepository(supabase);
  const { data: students } = await studentRepository.list({
    organizationId: profile.organization_id,
    pageSize: 500,
  });
  const studentOptions = students.map((student) => ({
    id: student.id,
    fullName: student.full_name,
    nis: student.nis,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Pembayaran</CardTitle>
      </CardHeader>
      <CardContent>
        <PaymentForm studentOptions={studentOptions} action={createPaymentAction} />
      </CardContent>
    </Card>
  );
}