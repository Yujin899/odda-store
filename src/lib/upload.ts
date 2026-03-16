/**
 * Uploads a file to Cloudinary via the internal upload API.
 * Use this instead of calling fetch('/api/upload') directly.
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
