import {
  Avatar,
  Button,
  Column,
  Heading,
  Icon,
  IconButton,
  Tag,
  Text,
  Schema,
  Row,
} from "@once-ui-system/core";
import { baseURL, about, generateMeta } from "@/resources";
import TableOfContents from "@/components/about/TableOfContents";
import styles from "@/components/about/about.module.scss";
import { PortableTextRenderer } from "@/components/sanity/PortableTextRenderer";
import React from "react";
import {
  getSiteConfig,
  getWorkExperience,
  getEducation,
  getSkills,
  getCertifications,
} from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import { l, lBlock, formatDateRange } from "@/sanity/locale";
import { DEFAULT_LOCALE, LOCALES, Locale, getT } from "@/i18n/translations";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata() {
  return generateMeta({
    title: about.title,
    description: about.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(about.title)}`,
    path: about.path,
  });
}

export default async function LocaleAbout({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = (LOCALES as readonly string[]).includes(rawLocale)
    ? (rawLocale as Locale)
    : DEFAULT_LOCALE;

  const t = getT(locale);
  const dateLocale = locale === "es" ? "es-GT" : "en-US";

  const [config, workExp, education, skills, certs] = await Promise.all([
    getSiteConfig(),
    getWorkExperience(),
    getEducation(),
    getSkills(),
    getCertifications(),
  ]);

  const name = config ? `${config.firstName} ${config.lastName}` : "";
  const role = l(config?.role, locale);
  const avatarUrl = config?.avatar
    ? urlForImage(config.avatar).width(300).height(300).url()
    : "";
  const calendarUrl = config?.calendarUrl;
  const socialLinks = config?.socialLinks ?? [];
  const hasBio = !!(config?.bio?.en?.length || config?.bio?.es?.length);

  const structure = [
    { title: about.intro.title, display: hasBio, items: [] },
    { title: t.about.work, display: workExp.length > 0, items: workExp.map((e) => e.company) },
    { title: t.about.studies, display: education.length > 0, items: education.map((e) => e.institution) },
    ...(certs.length > 0 ? [{ title: t.about.certifications, display: true, items: [] }] : []),
    { title: t.about.technical, display: skills.length > 0, items: [] },
  ];

  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={about.title}
        description={about.description}
        path={about.path}
        image={`/api/og/generate?title=${encodeURIComponent(about.title)}`}
        author={{
          name,
          url: `${baseURL}${about.path}`,
          image: avatarUrl,
        }}
      />
      {about.tableOfContent.display && (
        <Column
          left="0"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          position="fixed"
          paddingLeft="24"
          gap="32"
          s={{ hide: true }}
        >
          <TableOfContents structure={structure} about={about} />
        </Column>
      )}
      <Row fillWidth s={{ direction: "column" }} horizontal="center">
        {about.avatar.display && (
          <Column
            className={styles.avatar}
            top="64"
            fitHeight
            position="sticky"
            s={{ position: "relative", style: { top: "auto" } }}
            xs={{ style: { top: "auto" } }}
            minWidth="160"
            paddingX="l"
            paddingBottom="xl"
            gap="m"
            flex={3}
            horizontal="center"
          >
            {avatarUrl && <Avatar src={avatarUrl} size="xl" />}
            {config?.location && (
              <Row gap="8" vertical="center">
                <Icon onBackground="accent-weak" name="globe" />
                {config.location}
              </Row>
            )}
            {config?.languages && config.languages.length > 0 && (
              <Row wrap gap="8">
                {config.languages.map((lang, i) => (
                  <Tag key={i} size="l">{lang}</Tag>
                ))}
              </Row>
            )}
            {socialLinks.length > 0 && (
              <Row wrap gap="8" horizontal="center">
                {socialLinks.map((link) => (
                  <IconButton
                    key={link._id}
                    size="m"
                    href={link.url}
                    icon={link.icon}
                    variant="secondary"
                    tooltip={link.label || link.platform}
                  />
                ))}
              </Row>
            )}
          </Column>
        )}

        <Column className={styles.blockAlign} flex={9} maxWidth={40}>
          {/* ── Intro / Hero ── */}
          <Column
            id={about.intro.title}
            fillWidth
            minHeight="160"
            vertical="center"
            marginBottom="32"
          >
            {calendarUrl && (
              <Row
                fitWidth
                border="brand-alpha-medium"
                background="brand-alpha-weak"
                radius="full"
                padding="4"
                gap="8"
                marginBottom="m"
                vertical="center"
                className={styles.blockAlign}
                style={{ backdropFilter: "blur(var(--static-space-1))" }}
              >
                <Icon paddingLeft="12" name="calendar" onBackground="brand-weak" />
                <Row paddingX="8">{t.about.scheduleCall}</Row>
                <IconButton
                  href={calendarUrl}
                  data-border="rounded"
                  variant="secondary"
                  icon="chevronRight"
                />
              </Row>
            )}
            <Heading className={styles.textAlign} variant="display-strong-xl">
              {name}
            </Heading>
            <Text
              className={styles.textAlign}
              variant="display-default-xs"
              onBackground="neutral-weak"
            >
              {role}
            </Text>
            {socialLinks.length > 0 && (
              <Row
                className={styles.blockAlign}
                paddingTop="20"
                paddingBottom="8"
                gap="8"
                wrap
                horizontal="center"
                fitWidth
                data-border="rounded"
              >
                {socialLinks
                  .filter((link) => link.essential)
                  .map((link) => (
                    <React.Fragment key={link._id}>
                      <Row s={{ hide: true }}>
                        <Button
                          href={link.url}
                          prefixIcon={link.icon}
                          label={link.label || link.platform}
                          size="s"
                          weight="default"
                          variant="secondary"
                        />
                      </Row>
                      <Row hide s={{ hide: false }}>
                        <IconButton
                          size="l"
                          href={link.url}
                          icon={link.icon}
                          variant="secondary"
                        />
                      </Row>
                    </React.Fragment>
                  ))}
              </Row>
            )}
          </Column>

          {/* ── Bio ── */}
          {hasBio && (
            <Column textVariant="body-default-l" fillWidth gap="m" marginBottom="xl">
              <PortableTextRenderer value={lBlock(config?.bio, locale)} />
            </Column>
          )}

          {/* ── Work Experience ── */}
          {workExp.length > 0 && (
            <>
              <Heading as="h2" id={t.about.work} variant="display-strong-s" marginBottom="m">
                {t.about.work}
              </Heading>
              <Column fillWidth gap="l" marginBottom="40">
                {workExp.map((exp) => (
                  <Column key={exp._id} fillWidth>
                    <Row fillWidth horizontal="between" vertical="end" marginBottom="4">
                      <Text id={exp.company} variant="heading-strong-l">{exp.company}</Text>
                      <Text variant="heading-default-xs" onBackground="neutral-weak">
                        {formatDateRange(exp.startDate, exp.endDate, locale)}
                      </Text>
                    </Row>
                    <Text variant="body-default-s" onBackground="brand-weak" marginBottom="m">
                      {l(exp.role, locale)}
                    </Text>
                    {lBlock(exp.description, locale).length > 0 && (
                      <Column marginBottom="s">
                        <PortableTextRenderer value={lBlock(exp.description, locale)} />
                      </Column>
                    )}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <Column as="ul" gap="16">
                        {exp.achievements.map((achievement, i) => (
                          <Text as="li" variant="body-default-m" key={i}>
                            {l(achievement, locale)}
                          </Text>
                        ))}
                      </Column>
                    )}
                    {exp.tags && exp.tags.length > 0 && (
                      <Row wrap gap="8" paddingTop="m">
                        {exp.tags.map((tag, i) => (
                          <Tag key={i} size="m">{tag.label}</Tag>
                        ))}
                      </Row>
                    )}
                  </Column>
                ))}
              </Column>
            </>
          )}

          {/* ── Education ── */}
          {education.length > 0 && (
            <>
              <Heading as="h2" id={t.about.studies} variant="display-strong-s" marginBottom="m">
                {t.about.studies}
              </Heading>
              <Column fillWidth gap="l" marginBottom="40">
                {education.map((edu) => (
                  <Column key={edu._id} fillWidth gap="4">
                    <Text id={edu.institution} variant="heading-strong-l">{edu.institution}</Text>
                    <Text variant="body-default-m" onBackground="neutral-weak">
                      {l(edu.degree, locale)}
                    </Text>
                    <Text variant="heading-default-xs" onBackground="neutral-weak">
                      {formatDateRange(edu.startDate, edu.endDate, locale)}
                    </Text>
                    {lBlock(edu.description, locale).length > 0 && (
                      <Column marginTop="s">
                        <PortableTextRenderer value={lBlock(edu.description, locale)} />
                      </Column>
                    )}
                  </Column>
                ))}
              </Column>
            </>
          )}

          {/* ── Certifications ── */}
          {certs.length > 0 && (
            <>
              <Heading as="h2" id={t.about.certifications} variant="display-strong-s" marginBottom="m">
                {t.about.certifications}
              </Heading>
              <Column fillWidth gap="l" marginBottom="40">
                {certs.map((cert) => (
                  <Column key={cert._id} fillWidth gap="4">
                    <Row horizontal="between" vertical="end">
                      <Text variant="heading-strong-l">{l(cert.name, locale)}</Text>
                      <Text variant="heading-default-xs" onBackground="neutral-weak">
                        {new Date(cert.issuedDate).toLocaleDateString(dateLocale, {
                          month: "short",
                          year: "numeric",
                        })}
                      </Text>
                    </Row>
                    <Row gap="8" vertical="center">
                      <Text variant="body-default-s" onBackground="brand-weak">
                        {cert.issuer}
                      </Text>
                      {cert.credentialUrl && (
                        <Button
                          href={cert.credentialUrl}
                          size="s"
                          variant="tertiary"
                          suffixIcon="externalLink"
                          label={t.about.verify}
                        />
                      )}
                    </Row>
                  </Column>
                ))}
              </Column>
            </>
          )}

          {/* ── Skills ── */}
          {skills.length > 0 && (
            <>
              <Heading
                as="h2"
                id={t.about.technical}
                variant="display-strong-s"
                marginBottom="40"
              >
                {t.about.technical}
              </Heading>
              <Column fillWidth gap="l" marginBottom="40">
                {Object.entries(
                  skills.reduce<Record<string, typeof skills>>((acc, skill) => {
                    const cat = skill.category ?? "other";
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(skill);
                    return acc;
                  }, {})
                ).map(([category, categorySkills]) => (
                  <Column key={category} fillWidth gap="8">
                    <Text variant="label-strong-m" onBackground="neutral-weak">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                    <Row wrap gap="8">
                      {categorySkills.map((skill) => (
                        <Tag key={skill._id} size="l">{l(skill.name, locale)}</Tag>
                      ))}
                    </Row>
                  </Column>
                ))}
              </Column>
            </>
          )}
        </Column>
      </Row>
    </Column>
  );
}
