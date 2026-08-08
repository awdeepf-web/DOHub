import { notFound, redirect } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { invoiceService } from '@/services/invoice.service';
import { createClient } from '@/services/supabase/server';
import { StudentRepository } from '@/repositories/student.repository';
import { InvoiceForm } from '@/features/invoice/components/invoice-form';
import { updateInvoiceAction } from '@/features/invoice/invoice.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function EditInvoicePage({ params }: { params: { id: string } }) {
  const profile = await requireProfile();
  if (!hasPermission(profile.role, 'invoice:manage')) {
    redirect('/dashboard/invoice');
  }

  const invoice = await invoiceService.getById(params.id);
  if (!invoice || invoice.organization_id !== profile.organization_id) {
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

  const boundAction = updateInvoiceAction.bind(null, invoice.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <InvoiceForm invoice={invoice} studentOptions={studentOptions} action={boundAction} />
      </CardContent>
    </Card>
  );
}