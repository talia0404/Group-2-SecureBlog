// Backend/eslint.config.cjs
const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  { ignores: ["node_modules/**", "coverage/**", "ssl/**", "dist/**"] },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: { ...globals.node, ...globals.jest }
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": ["warn", { args: "after-used", argsIgnorePattern: "^_" }],
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off"
    }
  }
];
