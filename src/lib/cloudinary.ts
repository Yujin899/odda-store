import { v2 as cloudinary } from 'cloudinary';
export { optimizeCloudinaryUrl } from './cloudinary-utils';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary and returns the secure URL and publicId.
 * Used in server-side API routes for processing file uploads.
 * 
 * @param file - Buffer of the image to upload
 * @param folder - Destination folder in Cloudinary
 * @returns Object containing the secure URL and publicId
 */
export async function uploadImage(file: Buffer, folder: string): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Cloudinary upload failed'));
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(file);
  });
}

/**
 * Deletes an image from Cloudinary by its exact public ID.
 * Low-level utility called by deleteCloudinaryImage.
 * 
 * @param publicId - The unique Cloudinary public ID of the image
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    // We don't throw here to avoid breaking the main process if cleanup fails
  }
}

/**
 * Deletes an image from Cloudinary by its full secure URL.
 * Extracts the publicId automatically and handles the API call.
 * 
 * Call this whenever an entity with an image is deleted or its image is replaced.
 * Only works for images hosted on res.cloudinary.com.
 * 
 * @param imageUrl - Full Cloudinary secure URL of the image to delete
 */
export async function deleteCloudinaryImage(imageUrl: string): Promise<void> {
  if (!imageUrl || !imageUrl.includes('res.cloudinary.com')) return;

  try {
    // Extract everything after /upload/v[version]/ and before the extension
    // Logic: Split by /upload/, take the second part. Then split by / and skip the version (starts with 'v')
    const parts = imageUrl.split('/upload/');
    if (parts.length < 2) return;

    const pathParts = parts[1].split('/');
    // Remove the version part if it exists (e.g. v12345678)
    if (pathParts[0].startsWith('v')) {
      pathParts.shift();
    }

    // Join remaining parts and remove extension
    const fullPath = pathParts.join('/');
    const publicId = fullPath.split('.')[0];

    if (publicId) {
      await deleteImage(publicId);
    }
  } catch (error) {
    console.error('Failed to extract publicId for deletion:', error);
  }
}

export default cloudinary;
