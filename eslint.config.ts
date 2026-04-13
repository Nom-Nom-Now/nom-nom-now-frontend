import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "dist/**",
      "coverage/**",
      "node_modules/**",
      "public/**",
    ],
  },
  {
    files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  {
    files: ["src/**/*.vue"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
    rules: {
      "vue/no-undef-components": [
        "error",
        {
          ignorePatterns: [
            "md-.*",
            "router-link",
            "router-view",
            "RouterLink",
            "RouterView",
            "i18n-t",
            "I18nT",
          ],
        },
      ],
      "vue/no-deprecated-slot-attribute": [
        "error",
        {
          ignore: [],
          ignoreParents: ["md-outlined-button", "md-filled-button", "md-text-button", "md-filled-tonal-button", "md-icon-button", "md-filled-icon-button", "md-outlined-icon-button", "md-fab", "md-branded-fab", "md-tabs", "md-dialog", "md-menu", "md-select", "md-filled-select", "md-outlined-select", "md-chip", "md-assist-chip", "md-filter-chip", "md-input-chip", "md-suggestion-chip", "md-list-item", "md-menu-item", "md-outlined-text-field", "md-filled-text-field"],
        },
      ],
    },
  },
]);
