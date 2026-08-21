import { isLocale, type Locale } from "./config";

export function parseAcceptLanguage(header: string): Locale | null {
  const preferred = header
    .split(",")
    .map((tag) => (tag.split(";")[0] ?? "").trim().split("-")[0]?.toLowerCase() ?? "")
    .find((lang) => isLocale(lang));
  return preferred !== undefined && isLocale(preferred) ? preferred : null;
}
