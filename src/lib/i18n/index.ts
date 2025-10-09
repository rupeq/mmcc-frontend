import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi, { type HttpBackendOptions } from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import { i18nConfiguration } from "@/lib/i18n/configuration";

i18next
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init<HttpBackendOptions>(i18nConfiguration);

export default i18next;
