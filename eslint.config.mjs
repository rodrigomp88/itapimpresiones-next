import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: ["node_modules/", ".next/", "out/", "functions/", "public/", "src/__tests__/"],
  },
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      "@next/next/no-img-element": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "prefer-const": "warn",
      "no-var": "error",
    },
  }
);
