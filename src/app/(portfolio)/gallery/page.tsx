import { Flex, Meta, Schema } from "@once-ui-system/core";
import GalleryView from "@/components/gallery/GalleryView";
import { baseURL, gallery, person } from "@/resources";
import { getGalleryImages, getSiteConfig } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";

export async function generateMetadata() {
  return Meta.generate({
    title: gallery.title,
    description: gallery.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(gallery.title)}`,
    path: gallery.path,
  });
}

export default async function Gallery() {
  const [rawImages, config] = await Promise.all([getGalleryImages(), getSiteConfig()]);

  const authorName = config ? `${config.firstName} ${config.lastName}` : person.name;
  const authorAvatarUrl = config?.avatar
    ? urlForImage(config.avatar).width(64).height(64).url()
    : person.avatar;

  const images = rawImages.map((img) => ({
    ...img,
    imageUrl: urlForImage(img.image).width(800).url(),
  }));

  return (
    <Flex maxWidth="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={gallery.title}
        description={gallery.description}
        path={gallery.path}
        image={`/api/og/generate?title=${encodeURIComponent(gallery.title)}`}
        author={{
          name: authorName,
          url: `${baseURL}${gallery.path}`,
          image: authorAvatarUrl,
        }}
      />
      <GalleryView images={images} />
    </Flex>
  );
}
