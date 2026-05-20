import { Column, Text } from "@once-ui-system/core";
import { ProjectCard } from "@/components";
import { getProjects } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import { l } from "@/sanity/locale";
import { DEFAULT_LOCALE, Locale, getT } from "@/i18n/translations";

interface ProjectsProps {
  range?: [number, number?];
  exclude?: string[];
  locale?: Locale;
}

export async function Projects({ range, exclude, locale = DEFAULT_LOCALE }: ProjectsProps) {
  const t = getT(locale);

  let projects = await getProjects();

  if (exclude?.length) {
    projects = projects.filter((p) => !exclude.includes(p.slug));
  }

  const displayed = range
    ? projects.slice(range[0] - 1, range[1] ?? projects.length)
    : projects;

  if (!displayed.length) {
    if (range) return null;
    return (
      <Column fillWidth paddingY="xl" horizontal="center">
        <Text onBackground="neutral-weak" variant="body-default-m">
          {t.work.noProjects}
        </Text>
      </Column>
    );
  }

  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
      {displayed.map((project, index) => {
        const imageUrl = project.coverImage
          ? urlForImage(project.coverImage).width(1600).height(900).url()
          : "";
        const primaryLink = project.links?.[0]?.url ?? "";

        return (
          <ProjectCard
            priority={index < 2}
            key={project.slug}
            href={`/work/${project.slug}`}
            images={imageUrl ? [imageUrl] : []}
            title={l(project.title, locale)}
            description={l(project.summary, locale)}
            content={l(project.summary, locale)}
            avatars={[]}
            link={primaryLink}
          />
        );
      })}
    </Column>
  );
}
