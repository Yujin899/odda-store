import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a price amount with currency label.
 * Supports both EN and AR locales.
 */
export function formatPrice(
  amount: number,
  locale: 'en' | 'ar' = 'en',
  currency: string = 'EGP'
): string {
  const formatted = amount.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US');
  return locale === 'ar' 
    ? `${formatted} ج.م`
    : `${formatted} ${currency}`;
}

/**
 * Formats a date string or Date object.
 * Supports both EN and AR locales.
 */
export function formatDate(
  date: string | Date,
  locale: 'en' | 'ar' = 'en'
): string {
  return new Date(date).toLocaleDateString(
    locale === 'ar' ? 'ar-EG' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  );
}

/**
 * Maps order status to Tailwind color classes.
 * Used in both storefront and dashboard.
 */
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    confirmed:            'bg-primary/10 text-(--primary)',
    pending_verification: 'bg-warning/10 text-(--warning)',
    pending_payment:      'bg-warning/10 text-(--warning)',
    processing:           'bg-primary/10 text-(--primary)',
    shipped:              'bg-primary/10 text-(--primary)',
    delivered:            'bg-success/10 text-(--success)',
    cancelled:            'bg-danger/10 text-(--danger)',
  };
  return map[status] ?? 'bg-muted text-muted-foreground';
}

/**
 * Truncates text to a max length with ellipsis.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
