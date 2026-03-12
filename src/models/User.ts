import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// We explicitly export the interface to allow type hinting elsewhere if needed
export interface IUser extends Document {
  name: string;
  email: string;
  emailVerified?: Date | null;
  password?: string;
  image?: string;
  role: 'customer' | 'admin';
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    emailVerified: { type: Date, default: null },
    password: { type: String }, // optional for OAuth users
    image: { type: String },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Pre-save hook to hash password
UserSchema.pre('save', async function (this: IUser) {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (this: IUser, candidate: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

// Next.js hot-reloading workaround for Mongoose models
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
