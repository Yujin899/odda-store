'use server';

import { deleteCloudinaryImage as deleteImageServer } from '@/lib/cloudinary';

/**
 * Server Action to delete an image from Cloudinary safely.
 * This ensures the Cloudinary Node SDK is not bundled into client components.
 */
export async function deleteCloudinaryImage(url: string) {
  try {
    await deleteImageServer(url);
  } catch (error) {
    console.error('Action: deleteCloudinaryImage failed:', error);
  }
}
