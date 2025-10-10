import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import preferArrowFunctions from "eslint-plugin-prefer-arrow-functions";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import pluginRouter from "@tanstack/eslint-plugin-router";

export default [
  { ignores: ["dist"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginRouter.configs["flat/recommended"],
  {
    files: ["**/*.{ts,tsx,js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Node.js builtins
            ["^node:", "^\\u0000node:"],
            // React & React-DOM first
            ["^react$", "^react-dom"],
            // Other external packages
            ["^@?\\w"],
            // Internal packages (starting with @/)
            ["^@/"],
            // Parent imports (..)
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // Same-folder imports (./)
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // Style imports
            ["^.+\\.s?css$"],
          ],
        },
      ],
    },
  },
  preferArrowFunctions.configs.all,
];
