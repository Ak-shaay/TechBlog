import 'dotenv/config';
import mongoose from 'mongoose';
import { Blog } from '../server/models/Blog';
import fs from 'fs';
import path from 'path';

const generateSitemap = async () => {
  try {
    // 1. Connect to Database
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in .env");
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for Sitemap Generation');

    // 2. Fetch Data and Backfill Slugs
    const blogs = await Blog.find().select('_id title slug updatedAt');
    const baseUrl = process.env.SITE_URL || 'https://techtrendsai.in';

    let updatedCount = 0;
    for (const blog of blogs) {
      if (!blog.slug && blog.title) {
        let slug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        let count = 0;
        // Simple collision check logic for script (re-querying or checking in-memory set would be better for bulk but this is fine for small scale)
        while (await Blog.findOne({ slug, _id: { $ne: blog._id } })) {
          count++;
          slug = `${blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${count}`;
        }
        blog.slug = slug;
        await blog.save();
        updatedCount++;
      }
    }
    if (updatedCount > 0) console.log(`Backfilled slugs for ${updatedCount} blogs.`);

    console.log(`Found ${blogs.length} blogs.`);

    // 3. Generate XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/disclaimer</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`;

    blogs.forEach((blog: any) => {
      const slug = blog.slug || blog._id;
      xml += `  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${new Date(blog.updatedAt || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });

    xml += '</urlset>';

    // 4. Write to File
    const publicDir = path.join(process.cwd(), 'public');
    // Ensure public dir exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    const filePath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(filePath, xml);

    console.log(`✅ Sitemap generated successfully at: ${filePath}`);

    // Update robots.txt to point to sitemap
    const robotsPath = path.join(publicDir, 'robots.txt');
    let robotsContent = '';
    if (fs.existsSync(robotsPath)) {
      robotsContent = fs.readFileSync(robotsPath, 'utf8');
      if (!robotsContent.includes('Sitemap:')) {
        robotsContent += `\nSitemap: ${baseUrl}/sitemap.xml\n`;
        fs.writeFileSync(robotsPath, robotsContent);
        console.log('✅ Updated robots.txt with sitemap reference.');
      }
    }

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

generateSitemap();
