import { notFound } from 'next/navigation';
import { landingService } from '@/services/landing.service';
import type { Metadata } from 'next';

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

export default async function PublicLandingPage({ params }: { params: { slug: string } }) {
  const data = await landingService.getPublicLandingData(params.slug);

  if (!data) {
    notFound();
  }

  const { organization, sections } = data;

  const themeStyle = {
    '--brand-primary': organization.theme_primary_color,
  } as React.CSSProperties;

  return (
    <div style={themeStyle}>
      {/* Header sederhana dengan branding organisasi */}
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            {organization.logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={organization.logo_url}
                alt={organization.name}
                className="h-10 w-10 rounded object-contain"
              />
            )}
            <span className="text-lg font-bold">{organization.name}</span>
          </div>
          {organization.phone && (
            <a
              href={`https://wa.me/${organization.social_whatsapp ?? organization.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-4 py-2 text-sm font-medium text-primary-foreground"
              style={{ backgroundColor: organization.theme_primary_color }}
            >
              Hubungi Kami
            </a>
          )}
        </div>
      </header>

      {/* Render tiap blok konten */}
      {sections.map((section) => (
        <section key={section.id} className="border-b py-16">
          <div className="container">
            {section.section_type === 'hero' ? (
              <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-4xl font-bold">{section.heading}</h1>
                {section.subheading && (
                  <p className="mt-4 text-lg text-muted-foreground">{section.subheading}</p>
                )}
                {section.body && <p className="mt-4">{section.body}</p>}
              </div>
            ) : (
              <div className="mx-auto max-w-3xl">
                <h2 className="text-2xl font-bold">{section.heading}</h2>
                {section.subheading && (
                  <p className="mt-2 text-muted-foreground">{section.subheading}</p>
                )}
                {section.body && <p className="mt-4 whitespace-pre-line">{section.body}</p>}
              </div>
            )}
            {section.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={section.image_url}
                alt={section.heading}
                className="mx-auto mt-8 max-h-96 rounded-lg object-cover"
              />
            )}
          </div>
        </section>
      ))}

      {/* Kontak & sosial media */}
      <section className="py-16">
        <div className="container mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold">Hubungi Kami</h2>
          <div className="mt-4 space-y-1 text-sm text-muted-foreground">
            {organization.address && <p>{organization.address}</p>}
            {organization.phone && <p>{organization.phone}</p>}
            {organization.email && <p>{organization.email}</p>}
          </div>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            {organization.social_instagram && (
              <a
                href={organization.social_instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Instagram
              </a>
            )}
            {organization.social_facebook && (
              <a
                href={organization.social_facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Facebook
              </a>
            )}
            {organization.social_youtube && (
              <a
                href={organization.social_youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
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