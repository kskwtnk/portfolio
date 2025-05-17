import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import astro from "eslint-plugin-astro";
import { defineConfig } from "eslint/config";
import globals from "globals";
import ts from "typescript-eslint";

export default defineConfig([
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    plugins: { js, ts },
    extends: ["js/recommended", "ts/recommended"],
  },
  {
    files: ["**/*.astro"],
    plugins: { astro },
    extends: ["astro/recommended", "astro/jsx-a11y-recommended"],
    languageOptions: {
      parserOptions: {
        parser: "typescript-eslint-parser-for-extra-files",
      },
    },
  },
  prettier,
]);
