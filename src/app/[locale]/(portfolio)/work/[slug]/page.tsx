import { notFound } from "next/navigation";
import {
  Schema,
  Button,
  Column,
  Heading,
  Media,
  Text,
  SmartLink,
  Row,
  Line,
  Tag,
} from "@once-ui-system/core";
import { baseURL, about, work, generateMeta } from "@/resources";
import { ScrollToHash } from "@/components";
import { PortableTextRenderer } from "@/components/sanity/PortableTextRenderer";
import { Projects } from "@/components/work/Projects";
import { getProjectBySlug, getProjects, getSiteConfig } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import { l, lBlock } from "@/sanity/locale";
import { DEFAULT_LOCALE, LOCALES, Locale, getT } from "@/i18n/translations";
import { Metadata } from "next";

export async function generateStaticParams() {
  const projects = await getProjects();
  return LOCALES.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale: rawLocale } = await params;
  const locale: Locale = (LOCALES as readonly string[]).includes(rawLocale)
    ? (rawLocale as Locale)
    : DEFAULT_LOCALE;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return generateMeta({
    title: l(project.title, locale),
    description: l(project.summary, locale),
    baseURL: baseURL,
    image: project.coverImage
      ? urlForImage(project.coverImage).width(1200).height(630).url()
      : `/api/og/generate?title=${encodeURIComponent(l(project.title, locale))}`,
    path: `${work.path}/${project.slug}`,
  });
}

export default async function LocaleProject({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale: rawLocale } = await params;
  const locale: Locale = (LOCALES as readonly string[]).includes(rawLocale)
    ? (rawLocale as Locale)
    : DEFAULT_LOCALE;

  const t = getT(locale);
  const [project, config] = await Promise.all([getProjectBySlug(slug), getSiteConfig()]);

  if (!project) notFound();

  const authorName = config ? `${config.firstName} ${config.lastName}` : "";
  const authorAvatarUrl = config?.avatar
    ? urlForImage(config.avatar).width(64).height(64).url()
    : "";

  const coverUrl = project.coverImage
    ? urlForImage(project.coverImage).width(1600).height(900).url()
    : null;

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        path={`${work.path}/${project.slug}`}
        title={l(project.title, locale)}
        description={l(project.summary, locale)}
        datePublished={project.startDate ?? ""}
        dateModified={project.startDate ?? ""}
        image={coverUrl ?? `/api/og/generate?title=${encodeURIComponent(l(project.title, locale))}`}
        author={{
          name: authorName,
          url: `${baseURL}${about.path}`,
          image: authorAvatarUrl,
        }}
      />

      <Column maxWidth="s" gap="16" horizontal="center" align="center">
        <SmartLink href={`/${locale}${work.path}`}>
          <Text variant="label-strong-m">{t.work.backToProjects}</Text>
        </SmartLink>
        <Heading variant="display-strong-m">{l(project.title, locale)}</Heading>
        <Text variant="body-default-l" onBackground="neutral-weak" align="center">
          {l(project.summary, locale)}
        </Text>
      </Column>

      {project.tags && project.tags.length > 0 && (
        <Row gap="8" wrap horizontal="center">
          {project.tags.map((tag) => (
            <Tag key={tag.label} size="m">{tag.label}</Tag>
          ))}
        </Row>
      )}

      {project.links && project.links.length > 0 && (
        <Row gap="12" wrap horizontal="center">
          {project.links.map((link) => (
            <Button
              key={link.url}
              href={link.url}
              variant="secondary"
              size="s"
              suffixIcon="externalLink"
              label={link.label}
            />
          ))}
        </Row>
      )}

      {coverUrl && (
        <Media priority aspectRatio="16 / 9" radius="m" alt={l(project.title, locale)} src={coverUrl} />
      )}

      {lBlock(project.body, locale).length > 0 && (
        <Column style={{ margin: "auto" }} as="article" maxWidth="xs">
          <PortableTextRenderer value={lBlock(project.body, locale)} />
        </Column>
      )}

      <Column fillWidth gap="40" horizontal="center" marginTop="40">
        <Line maxWidth="40" />
        <Heading as="h2" variant="heading-strong-xl" marginBottom="24">
          {t.work.relatedProjects}
        </Heading>
        <Projects exclude={[project.slug]} range={[1, 3]} locale={locale} />
      </Column>
      <ScrollToHash />
    </Column>
  );
}
