import mongoose, { Schema, Document } from 'mongoose';

export interface IStoreSettings extends Document {
  hero: {
    image: string;
    heading: string;
    buttonText: string;
    buttonLink: string;
  };
  announcements: string[];
  instapayNumber: string;
  shippingFee: number;
  whatsappNumber?: string;
  contactEmail?: string;
  storeDescription?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
  };
}

const StoreSettingsSchema: Schema = new Schema(
  {
    hero: {
      image: { type: String },
      heading: { type: String, default: 'Browse premium instruments' },
      buttonText: { type: String, default: 'Shop Now' },
      buttonLink: { type: String, default: '/products' }
    },
    announcements: [{ type: String }],
    instapayNumber: { type: String, default: '01126131495' },
    shippingFee: { type: Number, default: 0 },
    whatsappNumber: { type: String },
    contactEmail: { type: String },
    storeDescription: { type: String },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
    },
  },
  { timestamps: true }
);

// This ensures we only have one settings document
export const StoreSettings = mongoose.models.StoreSettings || mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);
