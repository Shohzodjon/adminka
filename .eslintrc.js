module.exports = {
  root: true,

  env: {
    node: true,
    browser: true
  },

  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module"
  },

  extends: [
    "eslint:recommended",
    "plugin:vue/recommended",
    "plugin:vue/essential",
    "@vue/prettier"
  ],

  plugins: ["vue"],

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
          normal: "always",
          component: "always"
        },
        svg: "always",
        math: "always"
      }
    ],

    "vue/max-attributes-per-line": "off",
    "vue/no-v-html": "off",

    $langPrefix: "off",
    _: "off",
  },

  globals: {
    $langPrefix: false,
    _: false
  }
}
