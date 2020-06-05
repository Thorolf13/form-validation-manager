module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'eqeqeq': ['error', 'always', { 'null': 'ignore' }],
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
    'semi': ['error', 'always'],
    'space-before-function-paren': ['error', 'always'],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/eqeqeq': ['error', 'always', { 'null': 'ignore' }]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
