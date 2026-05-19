"use client";

import { Media, MasonryGrid } from "@once-ui-system/core";
import type { GalleryImage } from "@/sanity/types";
import { l } from "@/sanity/locale";

interface GalleryViewProps {
  images: (GalleryImage & { imageUrl: string })[];
}

export default function GalleryView({ images }: GalleryViewProps) {
  if (!images.length) return null;

  return (
    <MasonryGrid columns={2} s={{ columns: 1 }}>
      {images.map((image, index) => (
        <Media
          enlarge
          priority={index < 10}
          sizes="(max-width: 560px) 100vw, 50vw"
          key={image._id}
          radius="m"
          src={image.imageUrl}
          alt={l(image.alt)}
        />
      ))}
    </MasonryGrid>
  );
}
