module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    quotes: ["error", "double"],
    "import/no-unresolved": 0,
    indent: ["error", 2],
    "max-len": "off", // Desactivamos la regla de longitud máxima de línea

    // --- INICIO DE LA SOLUCIÓN ---
    // Esta regla le dice a ESLint que SIEMPRE debe haber un espacio
    // después de la llave de apertura y antes de la de cierre.
    // Esto hará que sea compatible con tu formateador automático.
    "object-curly-spacing": ["error", "always"],
    // --- FIN DE LA SOLUCIÓN ---
  },
};
