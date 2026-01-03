import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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

export const Blog = mongoose.model('Blog', blogSchema);
