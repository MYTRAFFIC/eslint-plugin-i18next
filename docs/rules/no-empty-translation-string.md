# no-empty-translation-string

Disallow empty strings in translation values.

## Rule Details

This rule aims to prevent empty strings in translation JSON files, which can lead to poor user experience by displaying blank content. Empty strings (including whitespace-only strings) in translation values are flagged as errors.

Examples of **incorrect** code for this rule:

```json
// translations.json
{
  "welcome": "",
  "greeting": "   ",
  "farewell": "\t\n  "
}
```

Examples of **correct** code for this rule:

```json
// translations.json
{
  "welcome": "Welcome to our application",
  "greeting": "Hello there!",
  "farewell": "Goodbye!"
}
```

## Options

This rule accepts an options object with the following properties:

### ignoreKeys

Array of strings to ignore. Translation keys that contain any of these strings will be ignored by the rule.

```json
{
  "i18next/no-empty-translation-string": [
    "error",
    {
      "ignoreKeys": ["debug_", "test_"]
    }
  ]
}
```

Example with options:

```json
// translations.json - This will NOT trigger errors
{
  "debug_empty": "",
  "test_placeholder": "",
  "normal_key": "This will trigger an error if empty"
}
```

## When Not To Use It

If you intentionally need empty translation strings in your application (for example, as placeholders that get filled dynamically), you should disable this rule for those specific keys using the `ignoreKeys` option.

## Further Reading

- [i18next Translation Management](https://www.i18next.com/overview/getting-started)
- [Internationalization Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)