import { ThemeToggle } from '@/components/ui/theme-toggle';
import { PlatformLogo } from '@/components/layout/platform-logo';
import { AuthBackgroundSlideshow } from '@/features/auth/components/auth-background-slideshow';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-57px)] grid-cols-1 lg:grid-cols-2">
      {/* Kolom/area kiri: berisi background (mobile: full, desktop: cuma form) */}
      <div className="relative flex min-h-[calc(100vh-57px)] flex-col overflow-hidden lg:min-h-0">
        {/* Background slideshow ditaruh sebagai elemen PERTAMA, otomatis di lapisan paling belakang.
            Ditampilkan penuh di HP; di desktop disembunyikan (karena ada versi terpisah di kolom kanan). */}
        <div className="absolute inset-0 lg:hidden">
          <AuthBackgroundSlideshow />
        </div>

        {/* Konten form, ditulis SETELAH background → otomatis tampil di atasnya tanpa perlu z-index */}
        <div className="relative flex flex-1 flex-col px-4 py-6">
          <div className="flex items-center justify-between">
            <PlatformLogo showTagline={false} />
            <ThemeToggle />
          </div>

          <div className="flex flex-1 items-center justify-center py-8">
            <div className="w-full max-w-md rounded-xl bg-background/95 p-6 shadow-xl backdrop-blur lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-0">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Kolom kanan: slideshow versi desktop saja */}
      <div className="hidden lg:block">
        <AuthBackgroundSlideshow />
      </div>
    </div>
  );
}