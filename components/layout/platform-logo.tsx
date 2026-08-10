import { PLATFORM_NAME, PLATFORM_TAGLINE, PLATFORM_LOGO_URL } from '@/config/platform';
import { cn } from '@/utils/cn';

export function PlatformLogo({
  showTagline = true,
  className,
}: {
  showTagline?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {PLATFORM_LOGO_URL ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={PLATFORM_LOGO_URL}
          alt={PLATFORM_NAME}
          className="h-9 w-9 rounded-lg object-contain"
        />
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          {PLATFORM_NAME.charAt(0)}
        </span>
      )}
      <div>
        <p className="text-base font-bold leading-none">{PLATFORM_NAME}</p>
        {showTagline && <p className="text-xs text-muted-foreground">{PLATFORM_TAGLINE}</p>}
      </div>
    </div>
  );
}