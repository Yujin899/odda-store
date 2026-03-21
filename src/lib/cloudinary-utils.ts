export type ImageContext = 
  | 'card'        // product/bundle cards — width: 600
  | 'detail'      // product/bundle detail main image — width: 1200  
  | 'thumbnail'   // detail page thumbnails — width: 200
  | 'hero'        // hero section — width: 1920
  | 'category'    // category cards — width: 400
  | 'admin';      // dashboard previews — NO optimization

export function optimizeCloudinaryUrl(
  url: string,
  context: ImageContext = 'card'
): string {
  if (!url || !url.includes('cloudinary.com')) return url;
  if (context === 'admin') return url;
  
  // Guard: if URL already has transformations, return as-is
  // This prevents double transformation
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;
  
  const afterUpload = url.slice(uploadIndex + 8);
  if (afterUpload.startsWith('f_') || afterUpload.startsWith('q_') || afterUpload.startsWith('w_')) {
    // URL already transformed — don't transform again
    return url;
  }
  
  const widthMap: Record<Exclude<ImageContext, 'admin'>, number> = {
    card: 600,
    detail: 1200,
    thumbnail: 200,
    hero: 1920,
    category: 400,
  };
  
  const width = widthMap[context as Exclude<ImageContext, 'admin'>];
  if (!width) return url; // safety guard against undefined
  
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}
