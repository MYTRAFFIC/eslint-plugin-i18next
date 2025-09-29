# no-missing-plural-count

Validate that plural translation keys contain `{count}` parameter.

## Rule Details

This rule checks i18next translation files (JSON) to ensure that plural keys (those ending with `_zero`, `_one`, `_two`, `_few`, `_many`, `_other`) include the `{count}` parameter in their translation values. When plural forms are missing the count parameter, i18next may display incorrect values or raw translation keys.

Examples of **incorrect** code for this rule:

```json
{
  "items_one": "You have 1 item",
  "items_other": "You have many items",
  "users_zero": "No users found",
  "users_few": "A few users"
}
```

Examples of **correct** code for this rule:

```json
{
  "items_one": "You have {count} item",
  "items_other": "You have {count} items",
  "users_zero": "{count} users found",
  "users_few": "{count} users"
}
```

## Options

```js
{
  "i18next/no-missing-plural-count": [
    "error",
    {
      "ignoreKeys": ["pattern1", "pattern2"]
    }
  ]
}
```

### `ignoreKeys`

An array of string patterns. Keys containing any of these patterns will be ignored by this rule.

Example:

```js
{
  "i18next/no-missing-plural-count": [
    "error",
    {
      "ignoreKeys": ["debug_", "temp_"]
    }
  ]
}
```

With this configuration, keys like `debug_items_one` or `temp_users_other` would be ignored.

## Usage with JSON files

This rule is designed to work with JSON translation files. You'll need to configure ESLint to parse JSON files using `jsonc-eslint-parser`:

### ESLint v9+ (Flat Config)

```js
import i18next from 'eslint-plugin-i18next';
import jsonParser from 'jsonc-eslint-parser';

export default [
  {
    files: ['**/locales/**/*.json'],
    languageOptions: {
      parser: jsonParser
    },
    plugins: {
      i18next
    },
    rules: {
      'i18next/no-missing-plural-count': 'error'
    }
  }
];
```

### ESLint v8 and below

```js
module.exports = {
  overrides: [
    {
      files: ['**/locales/**/*.json'],
      parser: 'jsonc-eslint-parser',
      plugins: ['i18next'],
      rules: {
        'i18next/no-missing-plural-count': 'error'
      }
    }
  ]
};
```

## When Not To Use It

If you don't use i18next pluralization features or if your translation files don't follow the standard `_zero`, `_one`, `_two`, `_few`, `_many`, `_other` suffix convention, you can disable this rule.

## Further Reading

- [i18next pluralization documentation](https://www.i18next.com/translation-function/plurals)
- [ICU plural rules](https://unicode-org.github.io/cldr-staging/charts/37/supplemental/language_plural_rules.html)