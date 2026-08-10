import { redirect } from 'next/navigation';
import { Check, X, Sparkles } from 'lucide-react';
import { requireProfile } from '@/utils/guard';
import { brandingService } from '@/services/branding.service';
import { UpgradeButton } from '@/features/upgrade/components/upgrade-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FREE_FEATURES = [
  { label: 'Manajemen Siswa, Guru, Kelas, Jadwal', included: true },
  { label: 'Absensi & Pembayaran', included: true },
  { label: 'Landing Page (maks. 3 blok konten)', included: true },
  { label: 'Warna tema kustom', included: false },
  { label: 'Domain kustom terhubung DNS', included: false },
  { label: 'Google Analytics & Meta Pixel', included: false },
  { label: 'Tanpa watermark "Dibuat dengan DOHub"', included: false },
];

const PRO_FEATURES = [
  { label: 'Semua fitur Free', included: true },
  { label: 'Landing Page unlimited blok konten', included: true },
  { label: 'Warna tema kustom penuh', included: true },
  { label: 'Domain kustom terhubung DNS', included: true },
  { label: 'Google Analytics & Meta Pixel', included: true },
  { label: 'Tanpa watermark', included: true },
];

export default async function UpgradePage() {
  const profile = await requireProfile();

  if (profile.role !== 'owner') {
    redirect('/dashboard');
  }

  const organization = await brandingService.getById(profile.organization_id);
  if (!organization) {
    redirect('/dashboard');
  }

  const isPro = organization.plan_type === 'pro';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Paket Langganan</h1>
        <p className="text-sm text-muted-foreground">
          Paket kamu saat ini:{' '}
          <Badge variant={isPro ? 'default' : 'secondary'}>{isPro ? 'Pro' : 'Free'}</Badge>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className={!isPro ? 'ring-2 ring-primary' : undefined}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Free
              {!isPro && <Badge>Paket Aktif</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold">Rp 0</p>
            <ul className="space-y-2 text-sm">
              {FREE_FEATURES.map((feature) => (
                <li key={feature.label} className="flex items-center gap-2">
                  {feature.included ? (
                    <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <X className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className={feature.included ? '' : 'text-muted-foreground'}>{feature.label}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className={isPro ? 'ring-2 ring-primary' : undefined}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-brand-accent" /> Pro
              </span>
              {isPro && <Badge>Paket Aktif</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold">Hubungi Kami</p>
            <ul className="space-y-2 text-sm">
              {PRO_FEATURES.map((feature) => (
                <li key={feature.label} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{feature.label}</span>
                </li>
              ))}
            </ul>
            <UpgradeButton currentPlan={organization.plan_type} />
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">
        Catatan: tombol upgrade ini sementara langsung mengaktifkan paket Pro untuk keperluan
        testing (belum terhubung payment gateway sungguhan).
      </p>
    </div>
  );
}