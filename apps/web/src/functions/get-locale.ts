import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestHeaders } from "@tanstack/react-start/server";
import { isLocale, loadMessages, DEFAULT_LOCALE, COOKIE_KEY } from "@interviews-tool/i18n/config";
import { parseAcceptLanguage } from "@interviews-tool/i18n/web";

export const getLocale = createServerFn({ method: "GET" }).handler(async () => {
  const saved = getCookie(COOKIE_KEY);
  if (isLocale(saved)) {
    return { locale: saved, messages: (await loadMessages(saved)) as Record<string, {}> };
  }
  const acceptLang = getRequestHeaders().get("accept-language") ?? "";
  const locale = parseAcceptLanguage(acceptLang) ?? DEFAULT_LOCALE;
  return { locale, messages: (await loadMessages(locale)) as Record<string, {}> };
});
