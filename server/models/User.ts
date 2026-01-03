import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    avatar: { type: String },
    socialLinks: {
        linkedin: { type: String },
        instagram: { type: String },
        facebook: { type: String },
        twitter: { type: String },
        youtube: { type: String },
        github: { type: String }
    }
});

export const User = mongoose.model('User', userSchema);
