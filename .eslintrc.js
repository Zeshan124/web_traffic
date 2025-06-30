module.exports = {
    extends: ['next/core-web-vitals'],
    plugins: ['@typescript-eslint'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-undef': 'off' // Next.js handles these globals for us
    },
    env: {
      browser: true,
      node: true,
      es6: true
    },
    globals: {
      React: 'writable',
      JSX: 'writable'
    }
  };