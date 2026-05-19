import { Column, Text } from "@once-ui-system/core";
import { ProjectCard } from "@/components";
import { getProjects } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import { l } from "@/sanity/locale";

interface ProjectsProps {
  range?: [number, number?];
  exclude?: string[];
}

export async function Projects({ range, exclude }: ProjectsProps) {
  let projects = await getProjects();

  if (exclude?.length) {
    projects = projects.filter((p) => !exclude.includes(p.slug));
  }

  const displayed = range
    ? projects.slice(range[0] - 1, range[1] ?? projects.length)
    : projects;

  if (!displayed.length) {
    return (
      <Column fillWidth paddingY="xl" horizontal="center">
        <Text onBackground="neutral-weak" variant="body-default-m">
          No projects to show yet.
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
            title={l(project.title)}
            description={l(project.summary)}
            content={l(project.summary)}
            avatars={[]}
            link={primaryLink}
          />
        );
      })}
    </Column>
  );
}
