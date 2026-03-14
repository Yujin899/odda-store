import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { Bundle } from '@/models/Bundle';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.odda-store.com';

  await connectDB();

  // Fetch all products and bundles
  const [products, bundles] = await Promise.all([
    Product.find({}, 'slug updatedAt').lean(),
    Bundle.find({}, 'slug updatedAt').lean(),
  ]);

  const productEntries: MetadataRoute.Sitemap = products.map((product: any) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const bundleEntries: MetadataRoute.Sitemap = bundles.map((bundle: any) => ({
    url: `${baseUrl}/bundle/${bundle.slug}`,
    lastModified: bundle.updatedAt ? new Date(bundle.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bundles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  return [...staticEntries, ...productEntries, ...bundleEntries];
}
