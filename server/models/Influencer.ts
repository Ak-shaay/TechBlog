import mongoose, { Document, Model } from 'mongoose';

export interface IInfluencer extends Document {
    name: string;
    slug: string;
    instagramId: string;
    email?: string;
    avatar?: string;
    bio?: string;
    socials?: {
        linkedin?: string;
        twitter?: string;
        github?: string;
        instagram?: string;
        facebook?: string;
        youtube?: string;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const influencerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    instagramId: { type: String, required: true },
    email: { type: String },
    avatar: { type: String },
    bio: { type: String },
    socials: {
        linkedin: { type: String },
        twitter: { type: String },
        github: { type: String },
        instagram: { type: String },
        facebook: { type: String },
        youtube: { type: String }
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Auto-generate slug from name before saving
influencerSchema.pre('save', async function (this: any) {
    if (this.isModified('name') || !this.slug) {
        if (!this.name) throw new Error('Name is required for slug generation');

        let baseSlug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        if (!baseSlug) baseSlug = 'influencer';

        let slug = baseSlug;
        let count = 0;

        // Ensure unique slug
        const InfluencerModel = this.constructor as any;
        while (await InfluencerModel.findOne({ slug, _id: { $ne: this._id } })) {
            count++;
            slug = `${baseSlug}-${count}`;
        }
        this.slug = slug;
    }
});

// Use a more robust model export for local development with hot-reloading
if (mongoose.models.Influencer) {
    delete (mongoose.models as any).Influencer;
}
export const Influencer: Model<IInfluencer> = mongoose.model<IInfluencer>('Influencer', influencerSchema);
