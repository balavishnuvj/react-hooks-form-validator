module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  env: {
    node: true,
    jest: true,
    browser: true,
    es6: true,
  },
  parser: 'babel-eslint',
  rules: {
    'prettier/prettier': 'error',
  },
};
