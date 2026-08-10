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
      {/* Background dekoratif — khusus mobile/tablet (desktop sudah punya slideshow di sisi kanan) */}
      <div className="pointer-events-none absolute inset-0 -z-10 lg:hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <main className="relative flex flex-col px-4 py-6">
        <div className="flex items-center justify-between">
          <PlatformLogo showTagline={false} />
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </main>

      <AuthBackgroundSlideshow />
    </div>
  );
}