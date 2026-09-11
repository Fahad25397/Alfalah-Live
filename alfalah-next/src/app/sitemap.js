import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';

export default async function sitemap() {
  const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alfalahhoney.com';
  
  await connectDB();
  const products = await Product.find({}, '_id updatedAt name');

  const productUrls = products.map((product) => ({
    url: `${frontendUrl}/?product=${product._id}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: `${frontendUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...productUrls,
  ];
}
