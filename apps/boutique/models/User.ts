import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    address?: string;
    role: 'user' | 'admin';
    avatar?: string;
    wishlist: mongoose.Types.ObjectId[]; // Array of Product IDs
    cart: {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        rentalDays: number;
        size?: string;
        rentalStartDate?: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String }, // Optional for cases like Google OAuth later
        phone: { type: String },
        address: { type: String },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        avatar: { type: String },
        wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        cart: [
            {
                productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true, default: 1 },
                rentalDays: { type: Number, required: true, default: 3 },
                size: { type: String },
                rentalStartDate: { type: Date },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Prevent mongoose from recompiling the model if it already exists
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
