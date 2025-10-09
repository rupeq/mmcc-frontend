import { defineConfig } from "i18next-cli";

import { defaultNamespace } from "./src/lib/i18n/configuration";

export default defineConfig({
  locales: ["en", "ru"],
  extract: {
    defaultNS: defaultNamespace,
    input: "src/**/*.{js,jsx,ts,tsx}",
    output: "public/locales/{{language}}/{{namespace}}.json",
    primaryLanguage: "ru",
    ignore: ["node_modules/**"],
  },
  types: {
    input: ["public/locales/ru/*.json", "public/locales/en/*.json"],
    output: "src/i18n/i18next.d.ts",
    resourcesFile: "src/i18n/resources.d.ts",
    enableSelector: true,
  },
});
