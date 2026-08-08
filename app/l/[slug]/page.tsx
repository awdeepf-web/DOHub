import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Sparkles, Info, CheckCircle2, ArrowRight, Phone, FileText, MapPin, Mail } from 'lucide-react';
import { landingService } from '@/services/landing.service';
import { buttonVariants } from '@/components/ui/button';
import type { LandingSectionType } from '@/types/database.types';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await landingService.getPublicLandingData(params.slug);
  return {
    title: data ? data.organization.name : 'Bimbel Tidak Ditemukan',
  };
}

const SECTION_ICON: Record<LandingSectionType, React.ComponentType<{ className?: string }>> = {
  hero: Sparkles,
  about: Info,
  features: CheckCircle2,
  cta: ArrowRight,
  contact: Phone,
  custom: FileText,
};

export default async function PublicLandingPage({ params }: { params: { slug: string } }) {
  const data = await landingService.getPublicLandingData(params.slug);

  if (!data) {
    notFound();
  }

  const { organization, sections } = data;
  const heroSection = sections.find((s) => s.section_type === 'hero');
  const otherSections = sections.filter((s) => s.section_type !== 'hero');

  const themeStyle = {
    '--brand-primary': organization.theme_primary_color,
    '--brand-secondary': organization.theme_secondary_color,
  } as React.CSSProperties;

  return (
    <div style={themeStyle}>
      {/* Header sticky */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            {organization.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={organization.logo_url}
                alt={organization.name}
                className="h-10 w-10 rounded-md object-contain"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                {organization.name.charAt(0)}
              </div>
            )}
            <span className="text-lg font-bold">{organization.name}</span>
          </div>
          {(organization.social_whatsapp || organization.phone) && (
            <a
              href={`https://wa.me/${(organization.social_whatsapp ?? organization.phone ?? '').replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: 'default', size: 'sm' })}
            >
              Hubungi Kami
            </a>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container flex flex-col items-center gap-6 py-20 text-center md:py-28">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            {organization.name}
          </span>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            {heroSection?.heading ?? `Belajar Bersama ${organization.name}`}
          </h1>
          {heroSection?.subheading && (
            <p className="max-w-xl text-lg text-muted-foreground">{heroSection.subheading}</p>
          )}
          {heroSection?.body && (
            <p className="max-w-2xl whitespace-pre-line text-muted-foreground">{heroSection.body}</p>
          )}
          {(organization.social_whatsapp || organization.phone) && (
            <a
              href={`https://wa.me/${(organization.social_whatsapp ?? organization.phone ?? '').replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: 'default', size: 'lg' })}
            >
              Daftar Sekarang <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          )}
          {heroSection?.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroSection.image_url}
              alt={heroSection.heading}
              className="mt-8 max-h-96 w-full max-w-3xl rounded-xl border object-cover shadow-lg"
            />
          )}
        </div>
      </section>

      {/* Blok konten lainnya */}
      {otherSections.map((section) => {
        const Icon = SECTION_ICON[section.section_type];
        const isCta = section.section_type === 'cta';

        return (
          <section
            key={section.id}
            className={isCta ? 'border-b bg-primary py-16 text-primary-foreground' : 'border-b py-16'}
          >
            <div className="container mx-auto max-w-3xl">
              <div className="flex items-center gap-2">
                <span
                  className={
                    isCta
                      ? 'flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15'
                      : 'flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground'
                  }
                >
                  <Icon className="h-4 w-4" />
                </span>
                <h2 className="text-2xl font-bold">{section.heading}</h2>
              </div>

              {section.subheading && (
                <p className={isCta ? 'mt-3 text-primary-foreground/80' : 'mt-3 text-muted-foreground'}>
                  {section.subheading}
                </p>
              )}

              {section.body && (
                <div className="mt-4 space-y-2">
                  {section.section_type === 'features' ? (
                    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {section.body
                        .split('\n')
                        .map((line) => line.trim())
                        .filter(Boolean)
                        .map((line, index) => (
                          <li key={index} className="flex items-start gap-2 rounded-lg border p-3 text-sm">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>{line}</span>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className={isCta ? 'whitespace-pre-line text-primary-foreground/90' : 'whitespace-pre-line'}>
                      {section.body}
                    </p>
                  )}
                </div>
              )}

              {section.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={section.image_url}
                  alt={section.heading}
                  className="mt-6 max-h-80 w-full rounded-lg border object-cover"
                />
              )}

              {isCta && (organization.social_whatsapp || organization.phone) && (
                <a
                  href={`https://wa.me/${(organization.social_whatsapp ?? organization.phone ?? '').replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center rounded-md bg-primary-foreground px-5 py-2.5 text-sm font-medium text-primary"
                >
                  Hubungi Kami Sekarang <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              )}
            </div>
          </section>
        );
      })}

      {/* Kontak */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold">Hubungi Kami</h2>
          <div className="mt-6 space-y-3 text-sm">
            {organization.address && (
              <p className="flex items-center justify-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" /> {organization.address}
              </p>
            )}
            {organization.phone && (
              <p className="flex items-center justify-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" /> {organization.phone}
              </p>
            )}
            {organization.email && (
              <p className="flex items-center justify-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" /> {organization.email}
              </p>
            )}
          </div>
          <div className="mt-6 flex justify-center gap-4 text-sm">
            {organization.social_instagram && (
              <a
                href={organization.social_instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-4"
              >
                Instagram
              </a>
            )}
            {organization.social_facebook && (
              <a
                href={organization.social_facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-4"
              >
                Facebook
              </a>
            )}
            {organization.social_youtube && (
              <a
                href={organization.social_youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-4"
              >
                YouTube
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}