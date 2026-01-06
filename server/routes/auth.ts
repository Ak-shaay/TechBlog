import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// router.post('/register', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new User({ username, password: hashedPassword });
//         await user.save();
//         res.status(201).json({ message: 'User created' });
//     } catch (error) {
//         console.error('Registration error', error);
//         res.status(500).json({ error: 'Error creating user' });
//     }
// });

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, username: user.username, id: user._id, avatar: user.avatar });
    } catch (error) {
        console.error('Login error', error);
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Update Profile
router.put('/profile', async (req: any, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'No token provided' });

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const { bio, avatar, socialLinks } = req.body;

        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (bio) user.bio = bio;
        if (avatar) user.avatar = avatar;
        if (socialLinks) user.socialLinks = { ...user.socialLinks, ...socialLinks };

        await user.save();
        res.json({ message: 'Profile updated', user: { username: user.username, bio: user.bio, avatar: user.avatar, socialLinks: user.socialLinks } });
    } catch (error) {
        console.error('Profile update error', error);
        res.status(500).json({ error: 'Error updating profile' });
    }
});

router.get('/profile/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching profile' });
    }
});

export default router;
