import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.grandoccasionrental.ie';
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://monkfish-app-7liuw.ondigitalocean.app';

async function fetchAllProducts() {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/products?pagination[pageSize]=200&fields[0]=id&fields[1]=updatedAt`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data ?? [];
  } catch {
    return [];
  }
}

async function fetchAllBlogs() {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/blogs?pagination[pageSize]=100&fields[0]=slug&fields[1]=updatedAt`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, blogs] = await Promise.all([fetchAllProducts(), fetchAllBlogs()]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/cancellation-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/delivery-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/terms-of-service`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p: any) => ({
    url: `${BASE_URL}/products/${p.id}`,
    lastModified: p.attributes?.updatedAt ? new Date(p.attributes.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogs.map((b: any) => ({
    url: `${BASE_URL}/blog/${b.attributes?.slug ?? b.id}`,
    lastModified: b.attributes?.updatedAt ? new Date(b.attributes.updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...blogPages];
}
