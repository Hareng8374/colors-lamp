// AI-assisted: written with Claude Code for the CI linting assignment.
import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // md5.js is a third-party library (JavaScript-MD5 by Sebastian Tschan) that
  // came with the lab files. We keep it exactly as published, so it's not linted.
  globalIgnores(["public/js/md5.js", "node_modules/"]),

  {
    files: ["public/js/**/*.js"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      ecmaVersion: 2022,
      // Plain <script> tags in the browser, not ES modules.
      sourceType: "script",
      globals: {
        ...globals.browser,
        // Defined by md5.js, which index.html loads before code.js.
        md5: "readonly",
      },
    },
    rules: {
      eqeqeq: "error",
      "no-var": "error",
      "prefer-const": "error",
    },
  },
]);
