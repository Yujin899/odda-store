import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind CSS classes with clsx logic.
 * Use this for all dynamic class merging to avoid conflicts.
 * @param inputs - Variadic list of class values
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a price amount with currency label.
 * Supports both EN and AR locales.
 * @param amount - The numeric price to format
 * @param locale - Site locale ('en' or 'ar')
 * @param currency - Optional currency code (defaults to EGP)
 * @returns Formatted price string with local currency symbol/label
 * @example
 * formatPrice(1500, 'ar') // '1,500 ج.م'
 * formatPrice(1500, 'en') // '1,500 EGP'
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
 * Supports both EN and AR locales with a numeric year and short month.
 * @param date - The date to format
 * @param locale - Site locale ('en' or 'ar')
 * @returns Formatted date string in local format
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
 * Used for status badges in both storefront profiles and admin dashboard tables.
 * @param status - The raw status string from MongoDB
 * @returns Tailwind CSS classes for background and text colors
 */
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    confirmed:            'bg-primary/10 text-primary',
    pending_verification: 'bg-warning/10 text-warning',
    pending_payment:      'bg-warning/10 text-warning',
    processing:           'bg-primary/10 text-primary',
    shipped:              'bg-primary/10 text-primary',
    delivered:            'bg-success/10 text-success',
    cancelled:            'bg-danger/10 text-danger',
  };
  return map[status] ?? 'bg-muted text-muted-foreground';
}

/**
 * Truncates text to a max length with ellipsis.
 * Useful for product descriptions in grid views.
 * @param text - The string to truncate
 * @param maxLength - Maximum characters allowed
 * @returns Truncated string with '...' if it exceeded maxLength
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
