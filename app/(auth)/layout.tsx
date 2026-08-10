import { ThemeToggle } from '@/components/ui/theme-toggle';
import { AuthBackgroundSlideshow } from '@/features/auth/components/auth-background-slideshow';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-57px)] grid-cols-1 lg:grid-cols-2">
      <main className="relative flex items-center justify-center px-4 py-10">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">{children}</div>
      </main>
      <AuthBackgroundSlideshow />
    </div>
  );
}