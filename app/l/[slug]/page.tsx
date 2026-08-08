import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  Sparkles,
  Info,
  CheckCircle2,
  ArrowRight,
  Phone,
  FileText,
  MapPin,
  Mail,
  Star,
  MessageCircle,
} from 'lucide-react';
import { landingService } from '@/services/landing.service';
import { buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
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

  const waLink = `https://wa.me/${(organization.social_whatsapp ?? organization.phone ?? '').replace(/\D/g, '')}`;
  const hasWa = Boolean(organization.social_whatsapp || organization.phone);

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
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {hasWa && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: 'default', size: 'sm' })}
              >
                Hubungi Kami
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b">
        {/* Radial glow lembut */}
        <div
          className="pointer-events-none absolute left-0 top-1/2 h-[32rem] w-[32rem] -translate-y-1/2 rounded-full opacity-25 blur-3xl"
          style={{ backgroundColor: organization.theme_primary_color }}
        />
        <div
          className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: organization.theme_secondary_color }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-background/40 via-background to-background/60" />

        <div className="container relative grid grid-cols-1 items-center gap-10 py-16 md:grid-cols-2 md:gap-14 md:py-24">
          {/* Kolom Kiri — copy & CTA */}
          <div className="flex flex-col items-start gap-6 text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-3 py-1.5 text-xs font-medium shadow-sm">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              4.9/5 oleh 300+ Siswa
            </span>

            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              {heroSection?.heading ?? `Wujudkan Prestasi Terbaikmu Bersama ${organization.name}`}
            </h1>

            {heroSection?.subheading ? (
              <p className="max-w-md text-lg text-muted-foreground">{heroSection.subheading}</p>
            ) : (
              <p className="max-w-md text-lg text-muted-foreground">
                Bimbingan belajar terpercaya dengan pengajar berpengalaman dan metode yang terbukti
                meningkatkan hasil belajar siswa.
              </p>
            )}

            {heroSection?.body && (
              <p className="max-w-lg whitespace-pre-line text-sm text-muted-foreground">
                {heroSection.body}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              {hasWa ? (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-600 px-8 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition-transform duration-200 hover:scale-105 hover:bg-emerald-500"
                >
                  Daftar Kelas Demo <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              ) : (
                <a
                  href="#program"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-600 px-8 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition-transform duration-200 hover:scale-105 hover:bg-emerald-500"
                >
                  Daftar Kelas Demo <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              )}
              <a href="#program" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                Lihat Program
              </a>
            </div>
          </div>

          {/* Kolom Kanan — gambar */}
          <div className="relative">
            {heroSection?.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroSection.image_url}
                alt={heroSection.heading}
                className="aspect-[4/3] w-full rounded-2xl border border-white/10 object-cover shadow-xl"
              />
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-primary/20 to-secondary/20 shadow-xl">
                <Sparkles className="h-16 w-16 text-primary/40" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Blok konten lainnya */}
      <div id="program">
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

                {isCta && hasWa && (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center rounded-md bg-primary-foreground px-5 py-2.5 text-sm font-medium text-primary transition-transform duration-200 hover:scale-105"
                  >
                    Hubungi Kami Sekarang <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Kontak */}
      <section className="bg-muted/30 py-16 pb-28 md:pb-16">
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

      {/* ============ Floating WhatsApp Button ============ */}
      {hasWa && (
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group fixed bottom-24 right-6 z-50 md:bottom-6"
          aria-label="Tanya via WhatsApp"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-green-500 opacity-75" />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-colors hover:bg-green-600">
            <MessageCircle className="h-6 w-6" />
          </span>
          <span className="absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
            Tanya via WhatsApp
          </span>
        </a>
      )}

      {/* ============ Sticky Bottom Bar CTA — khusus mobile ============ */}
      {hasWa && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/90 p-3 backdrop-blur md:hidden">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-emerald-600 text-sm font-semibold text-white shadow-md"
          >
            <MessageCircle className="h-4 w-4" />
            Konsultasi Kelas via WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}