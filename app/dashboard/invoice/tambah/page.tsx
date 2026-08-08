import { redirect } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { createClient } from '@/services/supabase/server';
import { StudentRepository } from '@/repositories/student.repository';
import { InvoiceForm } from '@/features/invoice/components/invoice-form';
import { createInvoiceAction } from '@/features/invoice/invoice.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function TambahInvoicePage() {
  const profile = await requireProfile();
  if (!hasPermission(profile.role, 'invoice:manage')) {
    redirect('/dashboard/invoice');
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
        <CardTitle>Tambah Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <InvoiceForm studentOptions={studentOptions} action={createInvoiceAction} />
      </CardContent>
    </Card>
  );
}