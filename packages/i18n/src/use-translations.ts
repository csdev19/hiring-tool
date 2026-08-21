import { useTranslations as useTranslationsBase } from "use-intl";
// Side-effect import: registers the IntlMessages augmentation for use-intl.
import "./messages.generated";

export { useTranslationsBase as useTranslations };
export type { MessageKey, MessageNamespace } from "./messages.generated";
