import { notFound } from "next/navigation";
import {
  Meta,
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
import { baseURL, about, work } from "@/resources";
import { ScrollToHash } from "@/components";
import { PortableTextRenderer } from "@/components/sanity/PortableTextRenderer";
import { Projects } from "@/components/work/Projects";
import { getProjectBySlug, getProjects, getSiteConfig } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import { l } from "@/sanity/locale";
import { Metadata } from "next";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return Meta.generate({
    title: l(project.title),
    description: l(project.summary),
    baseURL: baseURL,
    image: project.coverImage
      ? urlForImage(project.coverImage).width(1200).height(630).url()
      : `/api/og/generate?title=${encodeURIComponent(l(project.title))}`,
    path: `${work.path}/${project.slug}`,
  });
}

export default async function Project({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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
        title={l(project.title)}
        description={l(project.summary)}
        datePublished={project.startDate ?? ""}
        dateModified={project.startDate ?? ""}
        image={coverUrl ?? `/api/og/generate?title=${encodeURIComponent(l(project.title))}`}
        author={{
          name: authorName,
          url: `${baseURL}${about.path}`,
          image: authorAvatarUrl,
        }}
      />

      <Column maxWidth="s" gap="16" horizontal="center" align="center">
        <SmartLink href="/work">
          <Text variant="label-strong-m">Projects</Text>
        </SmartLink>
        <Heading variant="display-strong-m">{l(project.title)}</Heading>
        <Text variant="body-default-l" onBackground="neutral-weak" align="center">
          {l(project.summary)}
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
        <Media priority aspectRatio="16 / 9" radius="m" alt={l(project.title)} src={coverUrl} />
      )}

      {project.body?.en && project.body.en.length > 0 && (
        <Column style={{ margin: "auto" }} as="article" maxWidth="xs">
          <PortableTextRenderer value={project.body.en} />
        </Column>
      )}

      <Column fillWidth gap="40" horizontal="center" marginTop="40">
        <Line maxWidth="40" />
        <Heading as="h2" variant="heading-strong-xl" marginBottom="24">
          Related projects
        </Heading>
        <Projects exclude={[project.slug]} range={[1, 3]} />
      </Column>
      <ScrollToHash />
    </Column>
  );
}
