'use client';

import { useEffect, useState } from 'react';
import { AUTH_SLIDES, AUTH_SLIDE_INTERVAL_MS } from '@/config/auth-slides';

export function AuthBackgroundSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (AUTH_SLIDES.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % AUTH_SLIDES.length);
    }, AUTH_SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const slide = AUTH_SLIDES[index];

  if (!slide) {
    return null;
  }

  return (
    <div className="relative hidden h-full w-full overflow-hidden bg-neutral-950 lg:block">
      {/* Background: gambar kustom jika diisi, atau gradient blob bawaan */}
      {slide.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={slide.imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-neutral-950 to-secondary" />
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-secondary/40 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-primary/40 blur-3xl" />
        </>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Teks overlay */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-12">
        <h2 className="max-w-md text-3xl font-bold leading-tight text-white">{slide.title}</h2>
        <p className="max-w-sm text-sm text-white/80">{slide.subtitle}</p>

        {/* Dot indicator */}
        {AUTH_SLIDES.length > 1 && (
          <div className="mt-4 flex gap-1.5">
            {AUTH_SLIDES.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}