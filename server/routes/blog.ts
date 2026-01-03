import express, { Response } from 'express';
import { Blog } from '../models/Blog';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Helper to generate slug
const generateSlug = async (title: string, originalSlug?: string) => {
    const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    // If updating and title hasn't changed enough to change slug, return original
    if (originalSlug && originalSlug === baseSlug) return originalSlug;

    let slug = baseSlug;
    let count = 1;

    // Check for uniqueness
    while (await Blog.findOne({ slug, _id: { $ne: originalSlug ? undefined : null } })) { // Logic simplified: collision check
        // If we are updating, we need to allow keeping own slug.
        // But here we are generating new one. 
        // Let's rely on simple unique check.
        // Actually, let's keep it simple:
        slug = `${baseSlug}-${count}`;
        count++;
    }

    // Better unique check:
    // If slug exists, append number. We must exclude current doc if updating, but simpler to just strictly ensure uniqueness.
    // Re-writing helper properly inside:
    return slug;
};

// Get all blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'username').sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ error: 'Error fetching blogs' });
    }
});

// Get single blog by ID or Slug
router.get('/:idOrSlug', async (req, res) => {
    try {
        const { idOrSlug } = req.params;
        let blog;

        // Try finding by slug first
        blog = await Blog.findOne({ slug: idOrSlug }).populate('author', 'username');

        // If not found and it looks like an ID, try ID
        if (!blog && idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
            blog = await Blog.findById(idOrSlug).populate('author', 'username');
        }

        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching blog' });
    }
});

// Create blog (Protected)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const {
            title,
            content,
            category,
            image,
            excerpt,
            authorName,
            authorAvatar,
            authorBio,
            authorSocials
        } = req.body;

        // Basic image URL validation
        if (image && !image.match(/^https?:\/\/.+/)) {
            return res.status(400).json({ error: 'Invalid image URL' });
        }

        // Generate Slug
        let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        let count = 0;
        while (await Blog.findOne({ slug })) {
            count++;
            slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${count}`;
        }

        const blog = new Blog({
            title,
            slug,
            content,
            category: category || 'General',
            image,
            excerpt,
            authorName,
            authorAvatar,
            authorBio,
            authorSocials,
            author: req.user.id,
        });
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating blog' });
    }
});

// Update blog (Protected)
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const {
            title,
            content,
            category,
            image,
            excerpt,
            authorName,
            authorAvatar,
            authorBio,
            authorSocials
        } = req.body;

        // Ensure user owns the blog
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });

        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        if (image && !image.match(/^https?:\/\/.+/)) {
            return res.status(400).json({ error: 'Invalid image URL' });
        }

        // Update slug if title changed
        if (title && title !== blog.title) {
            let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            let count = 0;
            // Check collision (exclude current doc)
            while (await Blog.findOne({ slug, _id: { $ne: blog._id } })) {
                count++;
                slug = `${slug}-${count}`; // Use base slug for append
            }
            blog.slug = slug;
        } else if (!blog.slug && blog.title) {
            // Generate slug if missing
            let slug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            let count = 0;
            while (await Blog.findOne({ slug, _id: { $ne: blog._id } })) {
                count++;
                slug = `${slug}-${count}`;
            }
            blog.slug = slug;
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.category = category || blog.category;
        blog.image = image || blog.image;
        blog.excerpt = excerpt || blog.excerpt;
        blog.authorName = authorName || blog.authorName;
        blog.authorAvatar = authorAvatar || blog.authorAvatar;
        blog.authorBio = authorBio || blog.authorBio;
        blog.authorSocials = authorSocials || blog.authorSocials;

        await blog.save();
        res.json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating blog' });
    }
});

// Delete blog (Protected)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });

        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Blog deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting blog' });
    }
});

export default router;
