export type Step = 'gate' | 'summary' | 'shipping' | 'payment';

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  email: string;
}

export interface CheckoutSettings {
  instapayNumber: string;
  shippingFee: number;
}
