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
  theme: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    background: string;
    foreground: string;
    border: string;
    radius: string;
    brandDark: string;
  };
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
      default: "Hello {{customerName}},\n\nThank you for choosing Odda. Your order #{{orderNumber}} is confirmed and being processed. We will notify you once your premium instruments are on their way." 
    },
    confirmationSubjectAr: { 
      type: String, 
      default: "عدة - تأكيد الطلب رقم {{orderNumber}}" 
    },
    confirmationBodyAr: { 
      type: String, 
      default: "مرحباً {{customerName}}،\n\nشكراً لثقتك في عدة. تم تأكيد طلبك رقم {{orderNumber}} وجاري تجهيزه. سنقوم بإخطارك فور شحن أدواتك المتميزة." 
    },
    shippedSubjectEn: { 
      type: String, 
      default: "Odda - Your Order #{{orderNumber}} has Shipped!" 
    },
    shippedBodyEn: { 
      type: String, 
      default: "Great news {{customerName}}!\n\nYour order #{{orderNumber}} has been shipped and is on its way to you. Your clinical journey continues with Odda." 
    },
    shippedSubjectAr: { 
      type: String, 
      default: "عدة - تم شحن طلبك رقم {{orderNumber}}!" 
    },
    shippedBodyAr: { 
      type: String, 
      default: "أخبار رائعة {{customerName}}!\n\nتم شحن طلبك رقم {{orderNumber}} وهو الآن في طريقه إليك. رحلتك السريرية مستمرة مع عدة." 
    },
    defaultLanguage: { 
      type: String, 
      enum: ['en', 'ar'], 
      default: 'en' 
    },
    theme: {
      primary: { type: String, default: '#0073E6' },
      primaryForeground: { type: String, default: '#FFFFFF' },
      secondary: { type: String, default: '#F1F5F9' },
      secondaryForeground: { type: String, default: '#0A192F' },
      accent: { type: String, default: '#F8FAFC' },
      accentForeground: { type: String, default: '#0A192F' },
      background: { type: String, default: '#FFFFFF' },
      foreground: { type: String, default: '#0A192F' },
      border: { type: String, default: '#E2E8F0' },
      radius: { type: String, default: '0.5rem' },
      brandDark: { type: String, default: '#0A192F' },
    }
  },
  { timestamps: true }
);

// This ensures we only have one settings document. 
// We delete from models in dev to ensure schema changes are picked up.
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.StoreSettings;
}
export const StoreSettings = mongoose.models.StoreSettings || mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);
