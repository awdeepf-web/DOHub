import { redirect } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { GenerateInvoiceForm } from '@/features/invoice/components/generate-invoice-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function GenerateInvoicePage() {
  const profile = await requireProfile();
  if (!hasPermission(profile.role, 'invoice:manage')) {
    redirect('/dashboard/invoice');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Invoice Massal (SPP Bulanan)</CardTitle>
      </CardHeader>
      <CardContent>
        <GenerateInvoiceForm />
      </CardContent>
    </Card>
  );
}