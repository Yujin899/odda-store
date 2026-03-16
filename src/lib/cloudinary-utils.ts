/**
 * Adds Cloudinary transformation parameters to an image URL.
 * Converts to WebP automatically (f_auto) and applies smart compression (q_auto).
 * 
 * Use for ALL storefront image rendering. Never use raw Cloudinary URLs in UI.
 * Do NOT use for admin dashboard images (admins need full quality).
 * 
 * @param url - Original Cloudinary URL from MongoDB
 * @param options.width - Target width in pixels:
 *   - 600 for product/bundle cards
 *   - 1200 for product/bundle detail pages
 *   - 200 for thumbnails
 *   - 1920 for hero images
 * @param options.quality - Cloudinary quality setting (defaults to 'auto')
 * @returns Optimized Cloudinary URL with transformation params
 * @example
 * optimizeCloudinaryUrl(product.images[0].url, { width: 600 })
 */
export function optimizeCloudinaryUrl(
  url: string,
  options: { width?: number; quality?: string } = {}
): string {
  if (!url || !url.includes('cloudinary.com')) return url;
  const { width = 800, quality = 'auto' } = options;
  return url.replace(
    '/upload/',
    `/upload/f_auto,q_${quality},w_${width}/`
  );
}
