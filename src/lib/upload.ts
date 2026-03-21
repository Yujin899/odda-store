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

/**
 * Uploads an image with progress tracking via XHR.
 */
export async function uploadImageWithProgress(
  file: File,
  folder: string,
  onProgress: (percent: number, estimatedSecondsLeft: number) => void
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const startTime = Date.now();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        const elapsed = (Date.now() - startTime) / 1000;
        const speed = e.loaded / elapsed; // bytes per second
        // Check to prevent infinity if speed is 0
        const remaining = speed > 0 ? (e.total - e.loaded) / speed : 0;
        onProgress(percent, Math.ceil(remaining));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error('Upload failed'));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Upload failed')));

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  });
}
