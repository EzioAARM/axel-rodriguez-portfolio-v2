"use client";

import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "sanity";
import type { PortableTextReactComponents } from "@portabletext/react";
import { Text, SmartLink } from "@once-ui-system/core";

const components: Partial<PortableTextReactComponents> = {
  marks: {
    link: ({ children, value }) => (
      <SmartLink href={value?.href ?? "#"}>{children}</SmartLink>
    ),
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => <code>{children}</code>,
  },
  block: {
    normal: ({ children }) => (
      <Text as="p" variant="body-default-l" marginBottom="m">
        {children}
      </Text>
    ),
    h2: ({ children }) => (
      <Text as="h2" variant="heading-strong-xl" marginBottom="s" marginTop="l">
        {children}
      </Text>
    ),
    h3: ({ children }) => (
      <Text as="h3" variant="heading-strong-l" marginBottom="s" marginTop="m">
        {children}
      </Text>
    ),
    blockquote: ({ children }) => (
      <Text
        as="blockquote"
        variant="body-default-l"
        onBackground="neutral-weak"
        style={{ borderLeft: "3px solid var(--brand-solid-strong)", paddingLeft: "1rem" }}
        marginBottom="m"
      >
        {children}
      </Text>
    ),
  },
};

interface PortableTextRendererProps {
  value: PortableTextBlock[];
}

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  return <PortableText value={value} components={components} />;
}
