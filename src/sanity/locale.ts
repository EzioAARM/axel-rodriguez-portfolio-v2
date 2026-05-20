export type Locale = "en" | "es";
export const DEFAULT_LOCALE: Locale = "es";

/** Extract a string from a bilingual field */
export function l(
  field: { en?: string; es?: string } | null | undefined,
  locale: Locale = DEFAULT_LOCALE,
): string {
  if (!field) return "";
  return field[locale] || field.en || "";
}

/** Extract a PortableText block array from a bilingual field */
export function lBlock<T = unknown>(
  field: { en?: T[]; es?: T[] } | null | undefined,
  locale: Locale = DEFAULT_LOCALE,
): T[] {
  if (!field) return [];
  return field[locale] ?? field.en ?? [];
}

/** Format a Sanity date range into a readable timeframe string */
export function formatDateRange(
  startDate: string,
  endDate?: string | null,
  locale: Locale = DEFAULT_LOCALE,
): string {
  const dateLocale = locale === "es" ? "es-GT" : "en-US";
  const present = locale === "es" ? "Presente" : "Present";
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(dateLocale, { month: "short", year: "numeric" });
  return endDate ? `${fmt(startDate)} – ${fmt(endDate)}` : `${fmt(startDate)} – ${present}`;
}
