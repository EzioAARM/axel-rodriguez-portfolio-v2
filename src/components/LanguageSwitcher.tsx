"use client";

import { useRouter, usePathname } from "next/navigation";
import { DropdownWrapper, Dropdown, Option } from "@once-ui-system/core";
import { Button } from "@once-ui-system/core";
import { Locale, LOCALES, DEFAULT_LOCALE } from "@/i18n/translations";

const LOCALE_LABELS: Record<Locale, string> = {
  es: "ES",
  en: "EN",
};

function stripLocalePrefix(pathname: string): string {
  for (const loc of LOCALES) {
    if (pathname === `/${loc}`) return "/";
    if (pathname.startsWith(`/${loc}/`)) return pathname.slice(`/${loc}`.length);
  }
  return pathname;
}

interface LanguageSwitcherProps {
  locale: Locale;
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchToLocale = (next: string) => {
    const nextLocale = next as Locale;
    const basePath = stripLocalePrefix(pathname);
    if (nextLocale === DEFAULT_LOCALE) {
      router.push(basePath);
    } else {
      router.push(`/${nextLocale}${basePath}`);
    }
  };

  const trigger = (
    <Button
      size="s"
      variant="tertiary"
      suffixIcon="chevronDown"
      label={LOCALE_LABELS[locale]}
    />
  );

  return (
    <DropdownWrapper
      trigger={trigger}
      dropdown={
        <Dropdown onSelect={switchToLocale}>
          {LOCALES.map((loc) => (
            <Option
              key={loc}
              value={loc}
              label={LOCALE_LABELS[loc]}
              selected={locale === loc}
              onClick={switchToLocale}
            />
          ))}
        </Dropdown>
      }
      placement="bottom-end"
      closeAfterClick
    />
  );
}
