import mongoose, { Document, Model } from 'mongoose';

export interface IRevenueRecord extends Document {
    influencer: mongoose.Types.ObjectId;
    amount: number;
    period: {
        startDate: Date;
        endDate: Date;
    };
    source: string;
    notes?: string;
    isPaid: boolean;
    paidAt?: Date;
    createdBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const revenueRecordSchema = new mongoose.Schema({
    influencer: { type: mongoose.Schema.Types.ObjectId, ref: 'Influencer', required: true },
    amount: { type: Number, required: true }, // Amount in cents for precision
    period: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true }
    },
    source: { type: String, default: 'ezoic' },
    notes: { type: String },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const RevenueRecord: Model<IRevenueRecord> = mongoose.models.RevenueRecord || mongoose.model<IRevenueRecord>('RevenueRecord', revenueRecordSchema);
