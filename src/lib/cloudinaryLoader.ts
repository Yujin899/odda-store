/**
 * Cloudinary Loader for Next.js Image Component
 * This bypasses Vercel's Image Optimization API and offloads processing to Cloudinary's free tier.
 */
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // If the image is already a Cloudinary URL, we can inject transformation parameters
  if (src.includes('res.cloudinary.com')) {
    // Standard Cloudinary URL structure: https://res.cloudinary.com/[cloud]/image/upload/[params]/[id]
    const params = [
      'f_auto',
      'c_limit',
      `w_${width}`,
      `q_${quality || 'auto'}`,
    ].join(',');
    
    // Replace '/upload/' with '/upload/[params]/'
    return src.replace('/upload/', `/upload/${params}/`);
  }

  // Fallback for non-Cloudinary images (though we aim for 100% Cloudinary coverage)
  return src;
}
