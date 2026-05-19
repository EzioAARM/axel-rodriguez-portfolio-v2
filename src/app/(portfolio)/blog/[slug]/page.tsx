import { notFound } from "next/navigation";
import {
  Meta,
  Schema,
  Column,
  Heading,
  HeadingNav,
  Row,
  Text,
  SmartLink,
  Avatar,
  Media,
  Line,
  Tag,
} from "@once-ui-system/core";
import { baseURL, about, blog } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { ScrollToHash } from "@/components";
import { PortableTextRenderer } from "@/components/sanity/PortableTextRenderer";
import { Posts } from "@/components/blog/Posts";
import { ShareSection } from "@/components/blog/ShareSection";
import { getBlogPostBySlug, getBlogPosts, getSiteConfig } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import { l } from "@/sanity/locale";
import { Metadata } from "next";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return Meta.generate({
    title: l(post.title),
    description: l(post.summary),
    baseURL: baseURL,
    image: post.coverImage
      ? urlForImage(post.coverImage).width(1200).height(630).url()
      : `/api/og/generate?title=${encodeURIComponent(l(post.title))}`,
    path: `${blog.path}/${post.slug}`,
  });
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, config] = await Promise.all([getBlogPostBySlug(slug), getSiteConfig()]);

  if (!post) notFound();

  const authorName = config ? `${config.firstName} ${config.lastName}` : "";
  const authorAvatarUrl = config?.avatar
    ? urlForImage(config.avatar).width(64).height(64).url()
    : "";

  const coverUrl = post.coverImage
    ? urlForImage(post.coverImage).width(1200).height(675).url()
    : null;

  return (
    <Row fillWidth>
      <Row maxWidth={12} m={{ hide: true }} />
      <Row fillWidth horizontal="center">
        <Column as="section" maxWidth="m" horizontal="center" gap="l" paddingTop="24">
          <Schema
            as="blogPosting"
            baseURL={baseURL}
            path={`${blog.path}/${post.slug}`}
            title={l(post.title)}
            description={l(post.summary)}
            datePublished={post.publishedAt}
            dateModified={post.publishedAt}
            image={coverUrl ?? `/api/og/generate?title=${encodeURIComponent(l(post.title))}`}
            author={{
              name: authorName,
              url: `${baseURL}${about.path}`,
              image: authorAvatarUrl,
            }}
          />

          <Column maxWidth="s" gap="16" horizontal="center" align="center">
            <SmartLink href="/blog">
              <Text variant="label-strong-m">Blog</Text>
            </SmartLink>
            <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
              {formatDate(post.publishedAt)}
            </Text>
            <Heading variant="display-strong-m">{l(post.title)}</Heading>
            <Text
              variant="body-default-l"
              onBackground="neutral-weak"
              align="center"
              style={{ fontStyle: "italic" }}
            >
              {l(post.summary)}
            </Text>
          </Column>

          {post.tags && post.tags.length > 0 && (
            <Row gap="8" wrap horizontal="center">
              {post.tags.map((tag) => (
                <Tag key={tag.label} size="m">{tag.label}</Tag>
              ))}
            </Row>
          )}

          <Row marginBottom="8" horizontal="center">
            <Row gap="16" vertical="center">
              {authorAvatarUrl && <Avatar size="s" src={authorAvatarUrl} />}
              <Text variant="label-default-m" onBackground="brand-weak">{authorName}</Text>
              {post.readingTimeMinutes && (
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  {post.readingTimeMinutes} min read
                </Text>
              )}
            </Row>
          </Row>

          {coverUrl && (
            <Media
              src={coverUrl}
              alt={l(post.title)}
              aspectRatio="16/9"
              priority
              sizes="(min-width: 768px) 100vw, 768px"
              border="neutral-alpha-weak"
              radius="l"
              marginTop="12"
              marginBottom="8"
            />
          )}

          {post.body?.en && post.body.en.length > 0 && (
            <Column as="article" maxWidth="s">
              <PortableTextRenderer value={post.body.en} />
            </Column>
          )}

          <ShareSection
            title={l(post.title)}
            url={`${baseURL}${blog.path}/${post.slug}`}
          />

          <Column fillWidth gap="40" horizontal="center" marginTop="40">
            <Line maxWidth="40" />
            <Text as="h2" id="recent-posts" variant="heading-strong-xl" marginBottom="24">
              Recent posts
            </Text>
            <Posts exclude={[post.slug]} range={[1, 2]} columns="2" thumbnail direction="column" />
          </Column>
          <ScrollToHash />
        </Column>
      </Row>
      <Column
        maxWidth={12}
        paddingLeft="40"
        fitHeight
        position="sticky"
        top="80"
        gap="16"
        m={{ hide: true }}
      >
        <HeadingNav fitHeight />
      </Column>
    </Row>
  );
}
