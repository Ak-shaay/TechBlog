import express from 'express';
import { Influencer } from '../models/Influencer';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all influencers
router.get('/', async (req, res) => {
    try {
        const influencers = await Influencer.find().sort({ name: 1 });
        res.json(influencers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching influencers' });
    }
});

// Get single influencer by slug or ID
router.get('/:slugOrId', async (req, res) => {
    try {
        const { slugOrId } = req.params;
        let influencer;

        if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
            influencer = await Influencer.findById(slugOrId);
        } else {
            influencer = await Influencer.findOne({ slug: slugOrId });
        }

        if (!influencer) return res.status(404).json({ error: 'Influencer not found' });
        res.json(influencer);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching influencer' });
    }
});

// Create influencer (Protected)
router.post('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
    try {
        const influencer = new Influencer(req.body);
        await influencer.save();
        res.status(201).json(influencer);
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Influencer with this name/slug already exists' });
        }
        res.status(500).json({ error: 'Error creating influencer' });
    }
});

// Update influencer (Protected)
router.put('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
    try {
        const influencer = await Influencer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!influencer) return res.status(404).json({ error: 'Influencer not found' });
        res.json(influencer);
    } catch (error) {
        res.status(500).json({ error: 'Error updating influencer' });
    }
});

// Delete influencer (Protected)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
    try {
        const influencer = await Influencer.findByIdAndDelete(req.params.id);
        if (!influencer) return res.status(404).json({ error: 'Influencer not found' });
        res.json({ message: 'Influencer deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting influencer' });
    }
});

export default router;
