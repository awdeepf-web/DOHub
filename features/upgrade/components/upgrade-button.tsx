import { MessageCircle } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

const ADMIN_WHATSAPP_NUMBER = '628985151650';

export function UpgradeButton({
  organizationName,
  ownerName,
}: {
  organizationName: string;
  ownerName: string;
}) {
  const message = encodeURIComponent(
    `Halo Admin DOHub, saya ${ownerName} dari bimbel "${organizationName}". Saya ingin upgrade akun saya ke paket Pro. Mohon informasi lebih lanjut ya. Terima kasih.`,
  );
  const waLink = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${message}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonVariants({ variant: 'default' }) + ' w-full'}
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      Upgrade ke Pro Sekarang
    </a>
  );
}