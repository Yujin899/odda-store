import mongoose, { Schema, Document } from 'mongoose';

export interface IStoreSettings extends Document {
  hero: {
    image: string;
    heading: string;
    headingAr?: string;
    subHeading?: string;
    subHeadingAr?: string;
    buttonText: string;
    buttonTextAr?: string;
    buttonLink: string;
  };
  announcements: string[];
  announcementsAr: string[];
  instapayNumber: string;
  shippingFee: number;
  whatsappNumber?: string;
  contactEmail?: string;
  storeDescription?: string;
  storeDescriptionAr?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
  };
  confirmationSubjectEn: string;
  confirmationBodyEn: string;
  confirmationSubjectAr: string;
  confirmationBodyAr: string;
  shippedSubjectEn: string;
  shippedBodyEn: string;
  shippedSubjectAr: string;
  shippedBodyAr: string;
  defaultLanguage: 'en' | 'ar';
}

const StoreSettingsSchema: Schema = new Schema(
  {
    hero: {
      image: { type: String },
      heading: { type: String, default: 'Browse premium instruments' },
      headingAr: { type: String },
      subHeading: { type: String },
      subHeadingAr: { type: String },
      buttonText: { type: String, default: 'Shop Now' },
      buttonTextAr: { type: String },
      buttonLink: { type: String, default: '/products' }
    },
    announcements: [{ type: String }],
    announcementsAr: [{ type: String }],
    instapayNumber: { type: String, default: '01126131495' },
    shippingFee: { type: Number, default: 0 },
    whatsappNumber: { type: String },
    contactEmail: { type: String },
    storeDescription: { type: String },
    storeDescriptionAr: { type: String },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
    },
    confirmationSubjectEn: { 
      type: String, 
      default: "Odda - Order Confirmation #{{orderNumber}}" 
    },
    confirmationBodyEn: { 
      type: String, 
      default: "Hello {{customerName}},\n\nThank you for choosing Odda. Your order #{{orderNumber}} is confirmed and being processed." 
    },
    confirmationSubjectAr: { 
      type: String, 
      default: "أودا - تأكيد الطلب رقم {{orderNumber}}" 
    },
    confirmationBodyAr: { 
      type: String, 
      default: "مرحباً {{customerName}}،\n\nشكراً لثقتك في أودا. تم تأكيد طلبك رقم {{orderNumber}} وجاري تجهيزه." 
    },
    shippedSubjectEn: { 
      type: String, 
      default: "Odda - Your Order #{{orderNumber}} has Shipped!" 
    },
    shippedBodyEn: { 
      type: String, 
      default: "Great news {{customerName}}!\n\nYour order #{{orderNumber}} has been shipped and is on its way to you." 
    },
    shippedSubjectAr: { 
      type: String, 
      default: "أودا - تم شحن طلبك رقم {{orderNumber}}!" 
    },
    shippedBodyAr: { 
      type: String, 
      default: "أخبار رائعة {{customerName}}!\n\nتم شحن طلبك رقم {{orderNumber}} وهو الآن في طريقه إليك." 
    },
    defaultLanguage: { 
      type: String, 
      enum: ['en', 'ar'], 
      default: 'en' 
    }
  },
  { timestamps: true }
);

// This ensures we only have one settings document
export const StoreSettings = mongoose.models.StoreSettings || mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);
