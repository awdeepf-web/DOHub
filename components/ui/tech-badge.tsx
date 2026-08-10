import { cn } from '@/utils/cn';

export function TechBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border border-brand-accent/30 bg-brand-accent/10 px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-brand-accent',
        className,
      )}
    >
      {children}
    </span>
  );
}