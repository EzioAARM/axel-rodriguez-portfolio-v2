import { Button, Column, Row, Tag, Text, Heading, SmartLink } from "@once-ui-system/core";
import { getProjects } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import { l } from "@/sanity/locale";
import { DEFAULT_LOCALE, Locale, getT } from "@/i18n/translations";
import { StopPropagation } from "./StopPropagation";
import styles from "./Projects.module.scss";

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
    <Column fillWidth gap="16" marginBottom="40">
      {displayed.map((project) => {
        const imageUrl = project.coverImage
          ? urlForImage(project.coverImage).width(800).height(500).url()
          : "";
        const links = project.links ?? [];

        return (
          <SmartLink
            key={project.slug}
            href={`/work/${project.slug}`}
            className={styles.card}
            unstyled
          >
            <Row
              fillWidth
              border="neutral-alpha-medium"
              radius="l"
              overflow="hidden"
              s={{ direction: "column" }}
            >
              {/* Left — image */}
              {imageUrl && (
                <div className={styles.image} style={{ flex: 5 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt={l(project.title, locale)} />
                </div>
              )}

              {/* Right — content */}
              <Column
                flex={7}
                padding="l"
                gap="m"
                vertical="between"
              >
                {/* Top: title + tags */}
                <Column gap="s">
                  {project.tags && project.tags.length > 0 && (
                    <Row wrap gap="8">
                      {project.tags.slice(0, 4).map((tag) => (
                        <Tag key={tag.label} size="s">{tag.label}</Tag>
                      ))}
                    </Row>
                  )}
                  <Heading as="h3" variant="heading-strong-xl">
                    {l(project.title, locale)}
                  </Heading>
                </Column>

                {/* Bottom: description + links */}
                <Column gap="m">
                  <Text variant="body-default-m" onBackground="neutral-weak">
                    {l(project.summary, locale)}
                  </Text>
                  {links.length > 0 && (
                    <StopPropagation>
                      <Row wrap gap="8">
                        {links.map((link) => (
                          <Button
                            key={link.url}
                            href={link.url}
                            size="s"
                            variant="secondary"
                            suffixIcon="arrowUpRight"
                            label={link.label}
                          />
                        ))}
                      </Row>
                    </StopPropagation>
                  )}
                </Column>
              </Column>
            </Row>
          </SmartLink>
        );
      })}
    </Column>
  );
}
