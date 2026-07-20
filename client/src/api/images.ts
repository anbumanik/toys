import api from './client';
import type { ProductImage } from '../types/product';

/**
 * Uploads a batch of image files to POST /api/upload/image.
 * Reports combined progress (0-100) via onProgress as the browser streams the multipart body.
 */
export async function uploadImages(
  files: File[],
  onProgress?: (percent: number) => void
): Promise<{ uploaded: ProductImage[]; failed: { file: string; error: string }[] }> {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));

  const res = await api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) {
        onProgress(Math.round((evt.loaded / evt.total) * 100));
      }
    },
  });

  return res.data;
}

export async function deleteImage(imageId: string): Promise<void> {
  await api.delete(`/upload/image/${imageId}`);
}
