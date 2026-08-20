import { createContext, useContext, type ReactNode } from "react";
import { IntlProvider } from "use-intl";
import { TIME_ZONE, type Locale } from "./config";

export type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void | Promise<void>;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  locale,
  messages,
  setLocale,
}: {
  children: ReactNode;
  locale: Locale;
  messages: Record<string, unknown>;
  setLocale: I18nContextValue["setLocale"];
}) {
  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      <IntlProvider locale={locale} messages={messages} timeZone={TIME_ZONE}>
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useLocale must be used inside <I18nProvider>");
  return ctx;
}
