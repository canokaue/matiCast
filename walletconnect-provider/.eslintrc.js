module.exports = {
  parser: "babel-eslint",
  extends: "eslint:recommended",
  globals: {
    Promise: true,
    Buffer: true,
    fetch: true,
    require: true,
    process: true,
    module: true,
    setTimeout: true,
    __dirname: true
  },
  rules: {
    "space-before-function-paren": ["error", "never"],
    semi: ["error", "never"],
    "no-underscore-dangle": 0,
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    // trailing comma
    "comma-dangle": ["error", "always-multiline"],
    quotes: [
      "error",
      "single",
      { avoidEscape: true, allowTemplateLiterals: true }
    ]
  }
}
