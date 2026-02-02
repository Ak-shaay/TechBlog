import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function checkInfluencers() {
    try {
        await mongoose.connect(MONGODB_URI!);
        const Influencer = mongoose.model('Influencer', new mongoose.Schema({ name: String, slug: String }));
        const influencers = await Influencer.find();
        console.log('Existing Influencers:', JSON.stringify(influencers, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkInfluencers();
