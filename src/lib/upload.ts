/**
 * Uploads a file to Cloudinary via the internal /api/upload route.
 * 
 * Always use this instead of calling fetch('/api/upload') directly.
 * Handles FormData construction and error parsing internally.
 * 
 * @param file - The File object to upload
 * @param folder - Cloudinary folder. Use:
 *   - 'odda/products' for product images
 *   - 'odda/categories' for category images  
 *   - 'odda/payments' for InstaPay screenshots
 *   - 'odda/hero' for hero section images
 * @returns { url: string, publicId: string }
 * @throws Error if upload fails or server returns non-ok response
 */
export async function uploadImage(
  file: File,
  folder: 'odda/products' | 'odda/categories' | 'odda/payments' | 'odda/hero'
): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message || 'Upload failed');
  }

  return res.json();
}
