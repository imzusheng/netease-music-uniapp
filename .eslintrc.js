module.exports = {
  env: {
    browser: true,
    // es2021: true,
    node: true,
    es6: true
  },
  parser: 'vue-eslint-parser',
  extends: 'plugin:vue/essential',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'vue/multi-word-component-names': 'off'
  }
}
