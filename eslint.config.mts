import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import optimizeRegex from "eslint-plugin-optimize-regex";
import sonarjs from "eslint-plugin-sonarjs";
import globals from "globals";
import tseslint from "typescript-eslint";

import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],

    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },

    plugins: {
      js,
      import: importPlugin,
      sonarjs,
      "optimize-regex": optimizeRegex,
    },

    extends: [
      "js/recommended",
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      "prettier",
    ],

    settings: {
      "import/resolver": {
        typescript: true,
      },
    },

    rules: {
      // ---- code quality ----
      "sonarjs/no-duplicate-string": "warn",
      "sonarjs/cognitive-complexity": ["warn", 15],

      "optimize-regex/optimize-regex": "warn",

      // ---- imports ----
      "import/no-duplicates": "error",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc" },
        },
      ],

      // ---- TS sanity ----
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],

      // ---- Node CLI ----
      "no-console": "off",

      // ---- JS legacy crap ----
      "no-var": "error",
      "prefer-const": "error",
    },
  },
]);
