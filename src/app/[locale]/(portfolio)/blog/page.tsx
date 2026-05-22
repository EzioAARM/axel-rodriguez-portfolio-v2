import { Column, Heading, Schema } from "@once-ui-system/core";
import { Mailchimp } from "@/components";
import { Posts } from "@/components/blog/Posts";
import { baseURL, blog, person, generateMeta } from "@/resources";
import { getSiteConfig } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import { DEFAULT_LOCALE, LOCALES, Locale, getT } from "@/i18n/translations";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata() {
  return generateMeta({
    title: blog.title,
    description: blog.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(blog.title)}`,
    path: blog.path,
  });
}

export default async function LocaleBlog({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = (LOCALES as readonly string[]).includes(rawLocale)
    ? (rawLocale as Locale)
    : DEFAULT_LOCALE;

  const t = getT(locale);

  const config = await getSiteConfig();
  const authorName = config ? `${config.firstName} ${config.lastName}` : person.name;
  const authorAvatarUrl = config?.avatar
    ? urlForImage(config.avatar).width(64).height(64).url()
    : person.avatar;

  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        title={blog.title}
        description={blog.description}
        path={blog.path}
        image={`/api/og/generate?title=${encodeURIComponent(blog.title)}`}
        author={{
          name: authorName,
          url: `${baseURL}/blog`,
          image: authorAvatarUrl,
        }}
      />
      <Heading marginBottom="l" variant="heading-strong-xl" marginLeft="24">
        {blog.title}
      </Heading>
      <Column fillWidth flex={1} gap="40">
        <Posts range={[1, 1]} thumbnail locale={locale} />
        <Posts range={[2, 3]} columns="2" thumbnail direction="column" locale={locale} />
        {config?.showNewsletter && <Mailchimp marginBottom="l" />}
        <Heading as="h2" variant="heading-strong-xl" marginLeft="l">
          {t.blog.earlierPosts}
        </Heading>
        <Posts range={[4]} columns="2" locale={locale} />
      </Column>
    </Column>
  );
}
