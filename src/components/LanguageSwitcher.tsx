"use client";

import { useRouter } from "next/navigation";
import { Row, ToggleButton, Line } from "@once-ui-system/core";
import { Locale, LOCALE_COOKIE } from "@/i18n/translations";

interface LanguageSwitcherProps {
  locale: Locale;
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const router = useRouter();

  const switchLocale = (next: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}`;
    router.refresh();
  };

  return (
    <Row gap="4" vertical="center">
      <Line background="neutral-alpha-medium" vert maxHeight="24" />
      <ToggleButton
        label="ES"
        selected={locale === "es"}
        onClick={() => switchLocale("es")}
      />
      <ToggleButton
        label="EN"
        selected={locale === "en"}
        onClick={() => switchLocale("en")}
      />
    </Row>
  );
}
