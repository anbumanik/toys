import { useCallback, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import ImagePreview from './ImagePreview';
import { compressImage } from '../utils/compressImage';
import { uploadImages } from '../api/images';
import type { PendingImage, ProductImage } from '../types/product';

const MAX_IMAGES = 10;
const MAX_FILE_SIZE_MB = 8;
const ACCEPTED_TYPES = { 'image/jpeg': [], 'image/png': [], 'image/webp': [] };

interface Props {
  existingCount: number; // images already saved on the product (for the 10-image cap)
  onUploaded: (images: ProductImage[]) => void;
}

export default function ImageUploader({ existingCount, onUploaded }: Props) {
  const [pending, setPending] = useState<PendingImage[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const remainingSlots = MAX_IMAGES - existingCount - pending.length;

  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      setGlobalError(null);

      if (rejections.length) {
        const reasons = rejections.map((r) => r.errors.map((e) => e.message).join(', '));
        setGlobalError(`Some files were rejected: ${reasons.join('; ')}`);
      }

      if (accepted.length > remainingSlots) {
        setGlobalError(
          `You can only add ${remainingSlots} more image(s). Maximum ${MAX_IMAGES} images per product.`
        );
        accepted = accepted.slice(0, remainingSlots);
      }

      const newPending: PendingImage[] = accepted.map((file) => ({
        localId: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        status: 'pending',
        progress: 0,
      }));

      setPending((prev) => [...prev, ...newPending]);
    },
    [remainingSlots]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    disabled: remainingSlots <= 0 || isUploading,
    multiple: true,
  });

  const removePending = (localId: string) => {
    setPending((prev) => {
      const target = prev.find((p) => p.localId === localId);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.localId !== localId);
    });
  };

  const handleUpload = async () => {
    if (!pending.length) return;
    setIsUploading(true);
    setGlobalError(null);

    setPending((prev) => prev.map((p) => ({ ...p, status: 'uploading', progress: 0 })));

    try {
      // Client-side compression pass (parallel)
      const compressedFiles = await Promise.all(pending.map((p) => compressImage(p.file)));

      const { uploaded, failed } = await uploadImages(compressedFiles, (percent) => {
        setPending((prev) => prev.map((p) => ({ ...p, progress: percent })));
      });

      if (uploaded.length) {
        setPending((prev) =>
          prev.map((p, idx) =>
            idx < uploaded.length ? { ...p, status: 'done', progress: 100, result: uploaded[idx] } : p
          )
        );
        onUploaded(uploaded);
      }

      if (failed.length) {
        setGlobalError(`${failed.length} image(s) failed to upload.`);
        setPending((prev) =>
          prev.map((p) =>
            p.status !== 'done' ? { ...p, status: 'error', errorMessage: 'Upload failed' } : p
          )
        );
      } else {
        // Clear the queue once everything succeeded
        setTimeout(() => setPending([]), 800);
      }
    } catch (err: any) {
      setGlobalError(err?.response?.data?.message || 'Upload failed. Please try again.');
      setPending((prev) => prev.map((p) => ({ ...p, status: 'error' })));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="image-uploader">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'dropzone-active' : ''} ${
          remainingSlots <= 0 ? 'dropzone-disabled' : ''
        }`}
      >
        <input {...getInputProps()} />
        {remainingSlots <= 0 ? (
          <p>Maximum {MAX_IMAGES} images reached for this product.</p>
        ) : isDragActive ? (
          <p>Drop images here…</p>
        ) : (
          <p>
            Drag & drop up to {remainingSlots} image{remainingSlots === 1 ? '' : 's'}, or click to browse
            <br />
            <span className="dropzone-hint">JPEG, PNG, WebP — max {MAX_FILE_SIZE_MB}MB each</span>
          </p>
        )}
      </div>

      {globalError && <p className="uploader-error">{globalError}</p>}

      {pending.length > 0 && (
        <>
          <div className="preview-grid">
            {pending.map((img) => (
              <ImagePreview key={img.localId} image={img} onRemove={removePending} />
            ))}
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={handleUpload}
            disabled={isUploading || pending.every((p) => p.status === 'done')}
          >
            {isUploading ? 'Uploading…' : `Upload ${pending.length} image(s)`}
          </button>
        </>
      )}
    </div>
  );
}
