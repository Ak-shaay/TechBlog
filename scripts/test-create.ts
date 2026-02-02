import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// Import Influencer model structure directly to avoid import issues in script
const influencerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    instagramId: { type: String, required: true },
    email: { type: String },
    avatar: { type: String },
    bio: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

influencerSchema.pre('save', async function (next) {
    if (this.isModified('name') || !this.slug) {
        let baseSlug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        let slug = baseSlug;
        let count = 0;

        // Ensure unique slug
        const InfluencerModel = mongoose.model('Influencer');
        while (await InfluencerModel.findOne({ slug, _id: { $ne: this._id } })) {
            count++;
            slug = `${baseSlug}-${count}`;
        }

        this.slug = slug;
    }
    next();
});

const Influencer = mongoose.models.Influencer || mongoose.model('Influencer', influencerSchema);

async function testCreate() {
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log('Connected to DB');

        const testInf = new Influencer({
            name: 'Test Influencer ' + Date.now(),
            instagramId: 'test_id',
            email: 'test@example.com'
        });

        await testInf.save();
        console.log('Successfully created influencer:', testInf.slug);

        process.exit(0);
    } catch (error) {
        console.error('FAILED to create influencer:', error);
        process.exit(1);
    }
}

testCreate();
