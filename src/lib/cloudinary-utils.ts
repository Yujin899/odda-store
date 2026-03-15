/**
 * Optimizes a Cloudinary URL by adding transformation parameters
 * @param url Original Cloudinary URL
 * @param options Optimization options (width, quality)
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
