"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Button,
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

interface GalleryTranslations {
  all: string;
  noResults: string;
  clearLocation: string;
  filterByLocation: string;
  filterByTag: string;
  close: string;
}

interface GalleryViewProps {
  images: ImageWithUrls[];
  translations: GalleryTranslations;
}

export default function GalleryView({ images, translations: tr }: GalleryViewProps) {
  const [selected, setSelected] = useState<ImageWithUrls | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  const close = useCallback(() => setSelected(null), []);

  const allTags = useMemo(
    () =>
      [...new Set(images.flatMap((img) => img.tags?.map((t) => t.label) ?? []))].sort(),
    [images],
  );

  const filtered = useMemo(
    () =>
      images.filter((img) => {
        const matchesTag = !activeTag || img.tags?.some((t) => t.label === activeTag);
        const matchesLocation = !activeLocation || img.location === activeLocation;
        return matchesTag && matchesLocation;
      }),
    [images, activeTag, activeLocation],
  );

  const applyTagFilter = useCallback(
    (tag: string) => {
      setActiveTag((prev) => (prev === tag ? null : tag));
      close();
    },
    [close],
  );

  const applyLocationFilter = useCallback(
    (location: string) => {
      setActiveLocation((prev) => (prev === location ? null : location));
      close();
    },
    [close],
  );

  const clearFilters = useCallback(() => {
    setActiveTag(null);
    setActiveLocation(null);
  }, []);

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

  const hasActiveFilter = !!(activeTag || activeLocation);
  const hasMetadata = (img: ImageWithUrls) =>
    !!(l(img.caption) || img.location || img.dateTaken || img.tags?.length);

  return (
    <Column fillWidth gap="l">
      {/* ── Tag filter chips ── */}
      {allTags.length > 0 && (
        <Row wrap gap="8" paddingX="4">
          <Button
            size="s"
            variant={hasActiveFilter ? "secondary" : "primary"}
            label={tr.all}
            onClick={clearFilters}
          />
          {allTags.map((tag) => (
            <Button
              key={tag}
              size="s"
              variant={activeTag === tag ? "primary" : "secondary"}
              label={tag}
              onClick={() => applyTagFilter(tag)}
            />
          ))}
        </Row>
      )}

      {/* ── Active location chip ── */}
      {activeLocation && (
        <Row gap="8" vertical="center" paddingX="4">
          <Icon name="globe" size="s" onBackground="neutral-weak" />
          <Text variant="label-default-s" onBackground="neutral-weak">
            {activeLocation}
          </Text>
          <IconButton
            icon="x"
            size="s"
            variant="tertiary"
            onClick={() => setActiveLocation(null)}
            aria-label={tr.clearLocation}
          />
        </Row>
      )}

      {/* ── Grid ── */}
      {filtered.length > 0 ? (
        <MasonryGrid columns={2} s={{ columns: 1 }}>
          {filtered.map((image, index) => (
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
      ) : (
        <Flex fillWidth paddingY="xl" horizontal="center">
          <Text onBackground="neutral-weak" variant="body-default-m">
            {tr.noResults}
          </Text>
        </Flex>
      )}

      {/* ── Lightbox ── */}
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
                aria-label={tr.close}
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
              <Column background="neutral-weak" radius="m" padding="m" gap="s">
                {l(selected.caption) && (
                  <Text variant="body-default-m" onBackground="neutral-strong">{l(selected.caption)}</Text>
                )}

                <Row gap="24" wrap>
                  {selected.location && (
                    <Row
                      gap="8"
                      vertical="center"
                      style={{ cursor: "pointer" }}
                      title={tr.filterByLocation}
                      onClick={() => applyLocationFilter(selected.location!)}
                    >
                      <Icon name="globe" size="s" onBackground="brand-weak" />
                      <Text
                        variant="body-default-s"
                        onBackground="brand-weak"
                        style={{ textDecoration: "underline" }}
                      >
                        {selected.location}
                      </Text>
                    </Row>
                  )}
                  {selected.dateTaken && (
                    <Row gap="8" vertical="center">
                      <Icon name="calendar" size="s" onBackground="neutral-medium" />
                      <Text variant="body-default-s" onBackground="neutral-medium">
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
                      <Tag
                        key={tag.label}
                        size="s"
                        style={{ cursor: "pointer" }}
                        title={tr.filterByTag}
                        onClick={() => applyTagFilter(tag.label)}
                      >
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
    </Column>
  );
}
