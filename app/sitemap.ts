import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/**
 * Public sitemap. Per /docs/sitemap.md, only public pages are listed.
 * /report, /share, /dashboard, /api, /admin, /design-system stay out.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${BASE_URL}/`, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/upload`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/methodology`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/disclaimer`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/contact`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
