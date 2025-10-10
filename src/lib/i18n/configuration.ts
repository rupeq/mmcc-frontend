import { type InitOptions } from "i18next";
import type { HttpBackendOptions } from "i18next-http-backend";

export const fallbackLanguage = "ru";
export const supportedLanguages = ["en", "ru"];
export const namespaces = ["common", "authentication"];
export const defaultNamespace = "common";

export const i18nConfiguration: InitOptions<HttpBackendOptions> = {
  ns: namespaces,
  defaultNS: defaultNamespace,
  supportedLngs: supportedLanguages,
  debug: import.meta.env.DEV,
  fallbackLng: fallbackLanguage,
  interpolation: {
    escapeValue: false,
  },
  backend: {
    loadPath: "locales/{{lng}}/{{ns}}.json",
  },
  detection: {
    order: [
      "querystring",
      "cookie",
      "localStorage",
      "sessionStorage",
      "navigator",
      "htmlTag",
    ],
    lookupQuerystring: "language",
    lookupCookie: "i18next",
    lookupLocalStorage: "i18nextLng",
    lookupSessionStorage: "i18nextLng",
    caches: ["localStorage", "cookie"],
  },
  react: {
    useSuspense: true,
  },
};
