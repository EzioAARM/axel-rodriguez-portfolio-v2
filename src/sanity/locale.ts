export type Locale = "en" | "es";
export const DEFAULT_LOCALE: Locale = "en";

/** Extract a string from a bilingual field */
export function l(
  field: { en?: string; es?: string } | null | undefined,
  locale: Locale = DEFAULT_LOCALE,
): string {
  if (!field) return "";
  return field[locale] || field.en || "";
}

/** Format a Sanity date range into a readable timeframe string */
export function formatDateRange(startDate: string, endDate?: string | null): string {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  return endDate ? `${fmt(startDate)} – ${fmt(endDate)}` : `${fmt(startDate)} – Present`;
}
