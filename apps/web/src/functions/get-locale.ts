import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestHeaders } from "@tanstack/react-start/server";
import {
  isLocale,
  loadMessages,
  DEFAULT_LOCALE,
  COOKIE_KEY,
  type Locale,
} from "@interviews-tool/i18n/config";
import { parseAcceptLanguage } from "@interviews-tool/i18n/web";

interface LocalePayload {
  locale: Locale;
  messages: Record<string, object>;
}

export const getLocale = createServerFn({ method: "GET" }).handler(
  async (): Promise<LocalePayload> => {
    const saved = getCookie(COOKIE_KEY);
    if (isLocale(saved)) {
      return { locale: saved, messages: (await loadMessages(saved)) as Record<string, object> };
    }
    const acceptLang = getRequestHeaders().get("accept-language") ?? "";
    const locale = parseAcceptLanguage(acceptLang) ?? DEFAULT_LOCALE;
    return { locale, messages: (await loadMessages(locale)) as Record<string, object> };
  },
);
