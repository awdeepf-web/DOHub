import { notFound, redirect } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { paymentService } from '@/services/payment.service';
import { createClient } from '@/services/supabase/server';
import { StudentRepository } from '@/repositories/student.repository';
import { PaymentForm } from '@/features/pembayaran/components/payment-form';
import { updatePaymentAction } from '@/features/pembayaran/pembayaran.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function EditPembayaranPage({ params }: { params: { id: string } }) {
  const profile = await requireProfile();
  if (!hasPermission(profile.role, 'payment:manage')) {
    redirect('/dashboard/pembayaran');
  }

  const payment = await paymentService.getById(params.id);
  if (!payment || payment.organization_id !== profile.organization_id) {
    notFound();
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

  const boundAction = updatePaymentAction.bind(null, payment.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Pembayaran</CardTitle>
      </CardHeader>
      <CardContent>
        <PaymentForm payment={payment} studentOptions={studentOptions} action={boundAction} />
      </CardContent>
    </Card>
  );
}