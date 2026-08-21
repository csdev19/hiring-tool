export const AVAILABLE_LOCALES = ["en", "es"] as const;
export type Locale = (typeof AVAILABLE_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const COOKIE_KEY = "hiring-tool:locale";
export const TIME_ZONE = "America/Lima";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (AVAILABLE_LOCALES as readonly string[]).includes(value);
}

export async function loadMessages(locale: Locale): Promise<Record<string, unknown>> {
  switch (locale) {
    case "en":
      return (await import("../messages/en.json")).default as Record<string, unknown>;
    case "es":
      return (await import("../messages/es.json")).default as Record<string, unknown>;
    default:
      locale satisfies never;
      return (await import("../messages/en.json")).default as Record<string, unknown>;
  }
}
