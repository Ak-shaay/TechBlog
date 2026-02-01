import express from 'express';
import { RevenueRecord } from '../models/RevenueRecord';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all revenue records
router.get('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
    try {
        const { influencerId, isPaid } = req.query;
        const query: any = {};

        if (influencerId) query.influencer = influencerId;
        if (isPaid !== undefined) query.isPaid = isPaid === 'true';

        const records = await RevenueRecord.find(query)
            .populate('influencer', 'name slug')
            .sort({ createdAt: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching revenue records' });
    }
});

// Get revenue summary per influencer
router.get('/summary', authenticateToken, async (req: AuthRequest, res: express.Response) => {
    try {
        const summary = await RevenueRecord.aggregate([
            {
                $group: {
                    _id: '$influencer',
                    totalAmount: { $sum: '$amount' },
                    paidAmount: {
                        $sum: { $cond: [{ $eq: ['$isPaid', true] }, '$amount', 0] }
                    },
                    pendingAmount: {
                        $sum: { $cond: [{ $eq: ['$isPaid', false] }, '$amount', 0] }
                    }
                }
            },
            {
                $lookup: {
                    from: 'influencers',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'influencer'
                }
            },
            { $unwind: '$influencer' },
            {
                $project: {
                    _id: 1,
                    totalAmount: 1,
                    paidAmount: 1,
                    pendingAmount: 1,
                    influencerName: '$influencer.name',
                    influencerSlug: '$influencer.slug'
                }
            }
        ]);
        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: 'Error calculating summary' });
    }
});

// Log new revenue record
router.post('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
    try {
        const { influencerId, amount, startDate, endDate, notes } = req.body;
        const record = new RevenueRecord({
            influencer: influencerId,
            amount: Math.round(parseFloat(amount) * 100), // Store as cents
            period: {
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            },
            notes,
            createdBy: req.user.id
        });
        await record.save();
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ error: 'Error logging revenue' });
    }
});

// Mark as paid
router.put('/:id/paid', authenticateToken, async (req: AuthRequest, res: express.Response) => {
    try {
        const record = await RevenueRecord.findByIdAndUpdate(req.params.id, {
            isPaid: true,
            paidAt: new Date()
        }, { new: true });

        if (!record) return res.status(404).json({ error: 'Record not found' });
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: 'Error updating payment status' });
    }
});

export default router;
