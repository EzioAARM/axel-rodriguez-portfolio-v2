import {
  Heading,
  Text,
  Button,
  Avatar,
  RevealFx,
  Column,
  Badge,
  Row,
  Schema,
  Meta,
  Line,
  Grid,
  Icon,
} from "@once-ui-system/core";
import { home, about, person, baseURL, routes } from "@/resources";
import { Mailchimp } from "@/components";
import { Projects } from "@/components/work/Projects";
import { Posts } from "@/components/blog/Posts";
import { getSiteConfig, getServices } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import { l } from "@/sanity/locale";
import { DEFAULT_LOCALE, LOCALES, Locale, getT } from "@/i18n/translations";
import styles from "@/components/home/ServiceCard.module.scss";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = (LOCALES as readonly string[]).includes(rawLocale)
    ? (rawLocale as Locale)
    : DEFAULT_LOCALE;

  const t = getT(locale);

  const [config, services] = await Promise.all([getSiteConfig(), getServices()]);
  const authorName = config ? `${config.firstName} ${config.lastName}` : person.name;
  const avatarUrl = config?.avatar
    ? urlForImage(config.avatar).width(120).height(120).url()
    : person.avatar;

  const stats = config?.stats ?? [];
  const headline = l(config?.headline, locale) || home.headline;
  const subline = l(config?.subline, locale) || home.subline;

  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
        author={{
          name: authorName,
          url: `${baseURL}${about.path}`,
          image: avatarUrl,
        }}
      />
      <Column fillWidth horizontal="center" gap="m">
        <Column maxWidth="s" horizontal="center" align="center">
          {home.featured.display && (
            <RevealFx
              fillWidth
              horizontal="center"
              paddingTop="16"
              paddingBottom="32"
              paddingLeft="12"
            >
              <Badge
                background="brand-alpha-weak"
                paddingX="12"
                paddingY="4"
                onBackground="neutral-strong"
                textVariant="label-default-s"
                arrow={false}
                href={home.featured.href}
              >
                <Row paddingY="2">{home.featured.title}</Row>
              </Badge>
            </RevealFx>
          )}
          <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16">
            <Heading wrap="balance" variant="display-strong-l">
              {headline}
            </Heading>
          </RevealFx>
          <RevealFx translateY="8" delay={0.2} fillWidth horizontal="center" paddingBottom="32">
            <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
              {subline}
            </Text>
          </RevealFx>
          <RevealFx paddingTop="12" delay={0.4} horizontal="center" paddingLeft="12">
            <Button
              id="about"
              data-border="rounded"
              href={`/${locale}${about.path}`}
              variant="secondary"
              size="m"
              weight="default"
              arrowIcon
            >
              <Row gap="8" vertical="center" paddingRight="4">
                {about.avatar.display && (
                  <Avatar
                    marginRight="8"
                    style={{ marginLeft: "-0.75rem" }}
                    src={avatarUrl}
                    size="m"
                  />
                )}
                {about.title}
              </Row>
            </Button>
          </RevealFx>
        </Column>
      </Column>
      {/* ── Stats strip ── */}
      {stats.length > 0 && (
        <Row fillWidth horizontal="center" wrap gap="40" paddingY="24" paddingX="l">
          {stats.map((stat, i) => (
            <Column key={i} horizontal="center" gap="4">
              <Heading variant="display-strong-l" onBackground="neutral-strong">
                {stat.value}
              </Heading>
              <Text variant="label-default-s" onBackground="neutral-weak" align="center">
                {l(stat.label, locale)}
              </Text>
            </Column>
          ))}
        </Row>
      )}

      {/* ── What I do ── */}
      {services.length > 0 && (
        <Column fillWidth gap="l">
          <Heading as="h2" variant="display-strong-s" align="center">
            {t.home.whatIDo}
          </Heading>
          <Grid columns="3" s={{ columns: 1 }} fillWidth gap="16">
            {services.map((service) => (
              <Column
                key={service._id}
                className={styles.card}
                background="surface"
                radius="l"
                padding="l"
                gap="m"
              >
                {service.icon && (
                  <span className={styles.iconWrap}>
                    <Icon name={service.icon as Parameters<typeof Icon>[0]["name"]} size="m" onBackground="brand-weak" />
                  </span>
                )}
                <Heading as="h3" variant="heading-strong-l">
                  {l(service.title, locale)}
                </Heading>
                <Text variant="body-default-m" onBackground="neutral-weak">
                  {l(service.description, locale)}
                </Text>
              </Column>
            ))}
          </Grid>
        </Column>
      )}

      <Column fillWidth gap="l">
        <Heading as="h2" variant="display-strong-s" align="center">
          {t.home.projects}
        </Heading>
        <RevealFx translateY="16" delay={0.6}>
          <Projects range={[1, 1]} locale={locale} />
        </RevealFx>
      </Column>

      {routes["/blog"] && config?.showBlog !== false && (
        <Column fillWidth gap="24" marginBottom="l">
          <Row fillWidth paddingRight="64">
            <Line maxWidth={48} />
          </Row>
          <Row fillWidth gap="24" marginTop="40" s={{ direction: "column" }}>
            <Row flex={1} paddingLeft="l" paddingTop="24">
              <Heading as="h2" variant="display-strong-xs" wrap="balance">
                {t.home.latestBlog}
              </Heading>
            </Row>
            <Row flex={3} paddingX="20">
              <Posts range={[1, 2]} columns="2" locale={locale} />
            </Row>
          </Row>
          <Row fillWidth paddingLeft="64" horizontal="end">
            <Line maxWidth={48} />
          </Row>
        </Column>
      )}
      <Projects range={[2]} locale={locale} />
      {config?.showNewsletter && <Mailchimp />}
    </Column>
  );
}
