/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard"],
  rules: {
    // The IDs in styles.css are shared with the HTML pages and code.js
    // (getElementById), so they stay camelCase instead of the kebab-case
    // the standard config expects. Still require a lowercase first letter.
    "selector-id-pattern": [
      "^[a-z][a-zA-Z0-9]*(-[a-z0-9]+)*$",
      { message: "IDs should be camelCase or kebab-case (selector-id-pattern)" },
    ],
  },
};
