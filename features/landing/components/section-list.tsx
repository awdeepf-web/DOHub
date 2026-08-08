'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { DeleteSectionButton } from '@/features/landing/components/delete-section-button';
import { getSectionTypeLabel } from '@/utils/landing';
import { moveSectionUpAction, moveSectionDownAction } from '@/features/landing/landing.actions';
import type { LandingSection } from '@/types/database.types';

function ReorderButtons({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleMove(action: (id: string) => Promise<{ error: string | null }>) {
    startTransition(async () => {
      const result = await action(id);
      if (result.error) {
        window.alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => handleMove(moveSectionUpAction)}
      >
        ↑
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => handleMove(moveSectionDownAction)}
      >
        ↓
      </Button>
    </div>
  );
}

export function SectionList({ sections }: { sections: LandingSection[] }) {
  if (sections.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
        Belum ada konten landing page. Tambahkan blok pertama, misal &quot;Hero&quot;.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <Card key={section.id}>
          <CardContent className="flex items-start gap-4 p-4">
            <ReorderButtons id={section.id} />

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{getSectionTypeLabel(section.section_type)}</Badge>
                {!section.is_visible && <Badge variant="secondary">Disembunyikan</Badge>}
              </div>
              <p className="font-medium">{section.heading}</p>
              {section.subheading && (
                <p className="text-sm text-muted-foreground">{section.subheading}</p>
              )}
            </div>

            <div className="flex gap-2">
              <Link
                href={`/dashboard/landing/${section.id}`}
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                Edit
              </Link>
              <DeleteSectionButton id={section.id} heading={section.heading} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}