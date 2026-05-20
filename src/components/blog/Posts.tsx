import { Grid } from "@once-ui-system/core";
import Post from "./Post";
import { getBlogPosts, getSiteConfig } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import { l } from "@/sanity/locale";
import { DEFAULT_LOCALE, Locale } from "@/i18n/translations";

interface PostsProps {
  range?: [number] | [number, number];
  columns?: "1" | "2" | "3";
  thumbnail?: boolean;
  direction?: "row" | "column";
  exclude?: string[];
  locale?: Locale;
}

export async function Posts({
  range,
  columns = "1",
  thumbnail = false,
  exclude = [],
  direction,
  locale = DEFAULT_LOCALE,
}: PostsProps) {
  const [allPosts, config] = await Promise.all([getBlogPosts(), getSiteConfig()]);

  const authorName = config ? `${config.firstName} ${config.lastName}` : "";
  const authorAvatarUrl = config?.avatar
    ? urlForImage(config.avatar).width(80).height(80).url()
    : "";

  let filtered = exclude.length
    ? allPosts.filter((p) => !exclude.includes(p.slug))
    : allPosts;

  const displayed = range
    ? filtered.slice(range[0] - 1, range.length === 2 ? (range as [number, number])[1] : filtered.length)
    : filtered;

  if (!displayed.length) return null;

  const posts = displayed.map((p) => ({
    slug: p.slug,
    title: l(p.title, locale),
    summary: l(p.summary, locale),
    publishedAt: p.publishedAt,
    coverImageUrl: p.coverImage ? urlForImage(p.coverImage).width(1200).height(675).url() : undefined,
    tag: p.tags?.[0]?.label,
  }));

  return (
    <Grid columns={columns} s={{ columns: 1 }} fillWidth marginBottom="40" gap="16">
      {posts.map((post) => (
        <Post
          key={post.slug}
          post={post}
          authorName={authorName}
          authorAvatarUrl={authorAvatarUrl}
          thumbnail={thumbnail}
          direction={direction}
        />
      ))}
    </Grid>
  );
}
