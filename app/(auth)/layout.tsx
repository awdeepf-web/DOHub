import { ThemeToggle } from '@/components/ui/theme-toggle';
import { PlatformLogo } from '@/components/layout/platform-logo';
import { AuthBackgroundSlideshow } from '@/features/auth/components/auth-background-slideshow';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative grid min-h-[calc(100vh-57px)] grid-cols-1 overflow-hidden lg:grid-cols-2">
      {/* Slideshow SEKARANG tampil di semua ukuran layar sebagai background penuh */}
      <div className="absolute inset-0 -z-10 lg:hidden">
        <AuthBackgroundSlideshow />
      </div>

      <main className="relative flex flex-col px-4 py-6">
        <div className="flex items-center justify-between">
          <PlatformLogo showTagline={false} className="lg:[&_p]:text-white lg:[&_span]:text-white" />
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-md rounded-xl bg-background/95 p-6 shadow-xl backdrop-blur lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-0">
            {children}
          </div>
        </div>
      </main>

      {/* Versi desktop tetap seperti semula: slideshow di kolom kanan */}
      <div className="hidden lg:block">
        <AuthBackgroundSlideshow />
      </div>
    </div>
  );
}