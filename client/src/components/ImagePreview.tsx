import type { PendingImage } from '../types/product';

interface Props {
  image: PendingImage;
  onRemove: (localId: string) => void;
}

export default function ImagePreview({ image, onRemove }: Props) {
  return (
    <div className="image-preview-card">
      <img src={image.previewUrl} alt="" className="image-preview-thumb" loading="lazy" />

      {image.status === 'uploading' && (
        <div className="image-preview-progress-track">
          <div className="image-preview-progress-fill" style={{ width: `${image.progress}%` }} />
        </div>
      )}

      {image.status === 'error' && (
        <div className="image-preview-error" title={image.errorMessage}>
          Failed
        </div>
      )}

      {image.status === 'done' && <div className="image-preview-badge">✓</div>}

      <button
        type="button"
        className="image-preview-remove"
        onClick={() => onRemove(image.localId)}
        aria-label="Remove image"
        disabled={image.status === 'uploading'}
      >
        ×
      </button>
    </div>
  );
}
