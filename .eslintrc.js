module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  ignorePatterns: [".eslintrc.js", "webpack.config.js"],
  env: {
    es6: true,
  },
  parserOptions: {
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    camelcase: "error",
    "no-console": "warn",
    "no-nested-ternary": "error",
    "no-redeclare": "error",
  },
};
