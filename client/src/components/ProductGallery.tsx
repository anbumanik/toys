import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ProductImage } from '../types/product';
import { deleteImage as deleteFromCloudflare } from '../api/images';

interface Props {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void; // reorder / altText edits
  onDelete: (imageId: string) => void; // remove from state after Cloudflare delete
  onReplace: (imageId: string) => void; // trigger a re-upload flow for this slot
}

function SortableThumb({
  image,
  onDelete,
  onReplace,
  onAltChange,
  onZoom,
}: {
  image: ProductImage;
  onDelete: (id: string) => void;
  onReplace: (id: string) => void;
  onAltChange: (id: string, alt: string) => void;
  onZoom: (image: ProductImage) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.imageId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="gallery-item" {...attributes} {...listeners}>
      <img
        src={image.thumbnailUrl}
        alt={image.altText || 'Product image'}
        loading="lazy"
        className="gallery-thumb"
        onClick={() => onZoom(image)}
      />
      <input
        className="gallery-alt-input"
        placeholder="Alt text (SEO)"
        value={image.altText}
        onChange={(e) => onAltChange(image.imageId, e.target.value)}
        onPointerDown={(e) => e.stopPropagation()} // don't trigger drag while typing
      />
      <div className="gallery-item-actions">
        <button type="button" onClick={() => onReplace(image.imageId)}>
          Replace
        </button>
        <button type="button" className="danger" onClick={() => onDelete(image.imageId)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default function ProductGallery({ images, onChange, onDelete, onReplace }: Props) {
  const [zoomedImage, setZoomedImage] = useState<ProductImage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.imageId === active.id);
    const newIndex = images.findIndex((img) => img.imageId === over.id);
    const reordered = arrayMove(images, oldIndex, newIndex).map((img, idx) => ({ ...img, order: idx }));
    onChange(reordered);
  };

  const handleAltChange = (id: string, alt: string) => {
    onChange(images.map((img) => (img.imageId === id ? { ...img, altText: alt } : img)));
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm('Delete this image? This cannot be undone.')) return;
    setDeletingId(imageId);
    try {
      await deleteFromCloudflare(imageId);
      onDelete(imageId);
    } catch (err) {
      alert('Failed to delete image. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!images.length) {
    return <p className="gallery-empty">No images uploaded yet.</p>;
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images.map((i) => i.imageId)} strategy={rectSortingStrategy}>
          <div className="product-gallery-grid">
            {images.map((img) => (
              <SortableThumb
                key={img.imageId}
                image={img}
                onDelete={handleDelete}
                onReplace={onReplace}
                onAltChange={handleAltChange}
                onZoom={setZoomedImage}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {deletingId && <p className="gallery-status">Deleting image…</p>}

      {zoomedImage && (
        <div className="lightbox-overlay" onClick={() => setZoomedImage(null)}>
          <img src={zoomedImage.imageUrl} alt={zoomedImage.altText} className="lightbox-image" />
        </div>
      )}
    </>
  );
}
