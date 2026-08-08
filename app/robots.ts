import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/l/',
        disallow: ['/dashboard/', '/login', '/register'],
      },
    ],
  };
}