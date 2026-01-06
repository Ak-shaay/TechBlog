import express from 'express';
import { Blog } from '../models/Blog';

const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
    try {
        const blogs = await Blog.find().select('_id updatedAt');
        const baseUrl = process.env.SITE_URL || 'https://techtrendsai.in';

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`;

        blogs.forEach(blog => {
            xml += `  <url>
    <loc>${baseUrl}/blog/${blog._id}</loc>
    <lastmod>${new Date(blog.updatedAt || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
        });

        xml += '</urlset>';

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        res.status(500).send('Error generating sitemap');
    }
});

router.get('/robots.txt', (req, res) => {
    const baseUrl = process.env.SITE_URL || 'https://techtrendsai.in';
    const robots = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
`;
    res.header('Content-Type', 'text/plain');
    res.send(robots);
});

router.get('/llms.txt', (req, res) => {
    const llms = `# TechTrendsAI Context for LLMs

## About
TechTrendsAI is a platform for sharing insights on modern technology, software development, AI, and cloud infrastructure.

## Content Structure
- **Blog Posts**: Technical articles with code snippets and deep dives.
- **Categories**: AI & ML, Web Dev, Security, Cloud.

## Navigation
- Home: /
- Blog List: /blog
- About: /about
- Contact: /contact

## API Usage
- All content is accessible via public web pages.
- No public API for LLMs is currently exposed.
`;
    res.header('Content-Type', 'text/plain');
    res.send(llms);
});

export default router;
