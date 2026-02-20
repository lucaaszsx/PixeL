/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
    printWidth: 100,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: true,
    trailingComma: 'none',
    bracketSpacing: true,
    arrowParens: 'always',
    endOfLine: 'lf',
    quoteProps: 'consistent',
    proseWrap: 'never',
    bracketSameLine: false,
    embeddedLanguageFormatting: 'auto',
    singleAttributePerLine: false
};

export default config;
