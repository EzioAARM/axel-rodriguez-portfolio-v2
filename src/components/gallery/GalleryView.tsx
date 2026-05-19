"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Column,
  Flex,
  Icon,
  IconButton,
  MasonryGrid,
  Media,
  Row,
  Spinner,
  Tag,
  Text,
} from "@once-ui-system/core";
import type { GalleryImage } from "@/sanity/types";
import { l } from "@/sanity/locale";

type ImageWithUrls = GalleryImage & { imageUrl: string; highResUrl: string };

interface GalleryViewProps {
  images: ImageWithUrls[];
}

export default function GalleryView({ images }: GalleryViewProps) {
  const [selected, setSelected] = useState<ImageWithUrls | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const close = useCallback(() => setSelected(null), []);

  // Reset loader whenever a new image is opened
  useEffect(() => {
    if (selected) setIsLoading(true);
  }, [selected?._id]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, close]);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  if (!images.length) return null;

  const hasMetadata = (img: ImageWithUrls) =>
    !!(l(img.caption) || img.location || img.dateTaken || img.tags?.length);

  return (
    <>
      <MasonryGrid columns={2} s={{ columns: 1 }}>
        {images.map((image, index) => (
          <Media
            key={image._id}
            priority={index < 10}
            sizes="(max-width: 560px) 100vw, 50vw"
            radius="m"
            src={image.imageUrl}
            alt={l(image.alt)}
            style={{ cursor: "zoom-in" }}
            onClick={() => setSelected(image)}
          />
        ))}
      </MasonryGrid>

      {selected && (
        <Flex
          position="fixed"
          top="0"
          left="0"
          zIndex={9}
          center
          style={{
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
          }}
          onClick={close}
        >
          <Column
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            gap="m"
            style={{
              maxWidth: "min(90vw, 1100px)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <Row fillWidth horizontal="end">
              <IconButton
                icon="x"
                variant="secondary"
                size="m"
                onClick={close}
                aria-label="Close"
              />
            </Row>

            {/* Image with loader overlay */}
            <Column
              radius="m"
              overflow="hidden"
              style={{ position: "relative", minHeight: isLoading ? "300px" : undefined }}
            >
              {isLoading && (
                <Flex
                  center
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    background: "rgba(0,0,0,0.3)",
                  }}
                >
                  <Spinner size="l" />
                </Flex>
              )}
              {/* Native img to control onLoad — Sanity CDN already optimizes */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={selected._id}
                src={selected.highResUrl}
                alt={l(selected.alt)}
                onLoad={() => setIsLoading(false)}
                style={{
                  display: "block",
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  opacity: isLoading ? 0 : 1,
                  transition: "opacity 0.3s ease",
                  borderRadius: "var(--radius-m)",
                }}
              />
            </Column>

            {hasMetadata(selected) && (
              <Column background="surface" radius="m" padding="m" gap="s">
                {l(selected.caption) && (
                  <Text variant="body-default-m">{l(selected.caption)}</Text>
                )}

                <Row gap="24" wrap>
                  {selected.location && (
                    <Row gap="8" vertical="center">
                      <Icon name="globe" size="s" onBackground="neutral-weak" />
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        {selected.location}
                      </Text>
                    </Row>
                  )}
                  {selected.dateTaken && (
                    <Row gap="8" vertical="center">
                      <Icon name="calendar" size="s" onBackground="neutral-weak" />
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        {new Date(selected.dateTaken).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Text>
                    </Row>
                  )}
                </Row>

                {selected.tags && selected.tags.length > 0 && (
                  <Row wrap gap="8">
                    {selected.tags.map((tag) => (
                      <Tag key={tag.label} size="s">
                        {tag.label}
                      </Tag>
                    ))}
                  </Row>
                )}
              </Column>
            )}
          </Column>
        </Flex>
      )}
    </>
  );
}
