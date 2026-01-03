import express, { Response } from 'express';
import { Contact } from '../models/Contact';
import { Subscriber } from '../models/Subscriber';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// --- Contact Routes ---

// Submit Contact Message (Public)
router.post('/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) return res.status(400).json({ error: 'All fields are required' });

        const contact = new Contact({ name, email, message });
        await contact.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error sending message' });
    }
});

// Get Messages (Protected)
router.get('/contact', authenticateToken, async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
});

// --- Subscribe Routes ---

// Subscribe (Public)
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        // Check duplicate
        const exists = await Subscriber.findOne({ email });
        if (exists) return res.status(400).json({ error: 'Already subscribed' });

        const sub = new Subscriber({ email });
        await sub.save();
        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error subscribing' });
    }
});

// Get Subscribers (Protected)
router.get('/subscribe', authenticateToken, async (req, res) => {
    try {
        const subs = await Subscriber.find().sort({ createdAt: -1 });
        res.json(subs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching subscribers' });
    }
});

// Delete Subscriber (Protected)
router.delete('/subscribe/:id', authenticateToken, async (req, res) => {
    try {
        await Subscriber.findByIdAndDelete(req.params.id);
        res.json({ message: 'Subscriber deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting subscriber' });
    }
});

// Delete Message (Protected)
router.delete('/contact/:id', authenticateToken, async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting message' });
    }
});

export default router;
