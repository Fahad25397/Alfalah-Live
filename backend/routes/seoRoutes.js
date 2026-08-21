const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/sitemap.xml', async (req, res) => {
  try {
    const products = await Product.find({}, '_id updatedAt name');
    const frontendUrl = process.env.FRONTEND_URL || 'https://alfalah-store.vercel.app'; // Fallback to your main domain

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Storefront -->
  <url>
    <loc>${frontendUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

    products.forEach((product) => {
      // Use query parameter syncing for products to ensure they have a unique indexable URL
      const productUrl = `${frontendUrl}/?product=${product._id}`;
      xml += `
  <url>
    <loc>${productUrl}</loc>
    <lastmod>${product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    xml += `\n</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    console.error('Sitemap Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
});

module.exports = router;
