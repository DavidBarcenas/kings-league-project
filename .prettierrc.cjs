module.exports = {
  printWidth: 100,
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  useTabs: false,
  plugins: [require.resolve('prettier-plugin-astro')],
  overrides: [
    {
      files: ['*.json', '*.md', '*.toml', '*.yml'],
      options: {
        useTabs: false
      }
    }
  ],
  endOfLine: 'lf',
  bracketSpacing: true,
  quoteProps: 'as-needed',
  arrowParens: 'always',
  htmlWhitespaceSensitivity: 'css',
  jsxBracketSameLine: false
}
