import mongoose, { Document, Model } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    slug: string;
    content: string;
    author: mongoose.Types.ObjectId;
    influencer?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    category: string;
    image?: string;
    excerpt?: string;
    authorName: string;
    authorAvatar?: string;
    authorBio?: string;
    authorSocials?: {
        linkedin?: string;
        twitter?: string;
        github?: string;
        instagram?: string;
        facebook?: string;
        youtube?: string;
    };
}

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    influencer: { type: mongoose.Schema.Types.ObjectId, ref: 'Influencer' },
    createdAt: { type: Date, default: Date.now },
    category: { type: String, default: 'General' },
    image: { type: String },
    excerpt: { type: String },
    // Manual Author Details
    authorName: { type: String, required: true },
    authorAvatar: { type: String },
    authorBio: { type: String },
    authorSocials: {
        linkedin: { type: String },
        twitter: { type: String },
        github: { type: String },
        instagram: { type: String },
        facebook: { type: String },
        youtube: { type: String }
    },
}, { timestamps: true });

export const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', blogSchema);
