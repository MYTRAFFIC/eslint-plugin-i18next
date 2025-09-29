const RuleTester = require('eslint').RuleTester;
const rule = require('../../../../lib/rules/no-empty-translation-string');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'script',
    parser: require('jsonc-eslint-parser'),
  },
});

const cases = {
  valid: [
    // Valid translation values with content
    {
      filename: 'test.json',
      code: JSON.stringify(
        {
          welcome: 'Welcome to our application',
          hello: 'Hello World',
          goodbye: 'Goodbye!',
          hello_world: 'Hello World',
        },
        null,
        2
      ),
    },
    // Support nesting
    {
      filename: 'test.json',
      code: JSON.stringify(
        {
          welcome: {
            title: 'Welcome',
            subtitle: 'Welcome',
          },
        },
        null,
        2
      ),
    },
    // Keys that should be ignored
    {
      filename: 'test.json',
      code: JSON.stringify(
        {
          debug_empty: '',
          normal_key: 'valid content',
        },
        null,
        2
      ),
      options: [{ ignoreKeys: ['debug_'] }],
    },
  ],
  invalid: [
    // Empty strings should trigger errors
    {
      filename: 'test.json',
      code: JSON.stringify(
        {
          empty_key: '',
          valid_key: 'Valid content',
          another_empty: '',
        },
        null,
        2
      ),
      errors: [
        {
          message:
            'Translation key "empty_key" has an empty string value. Translation values should not be empty.',
          line: 2,
        },
        {
          message:
            'Translation key "another_empty" has an empty string value. Translation values should not be empty.',
          line: 4,
        },
      ],
    },
    // Whitespace-only strings should trigger errors
    {
      filename: 'test.json',
      code: JSON.stringify(
        {
          whitespace_only: '   ',
          tabs_and_spaces: '\t  \n  ',
          newlines_only: '\n\n',
          valid_key: 'This is valid',
        },
        null,
        2
      ),
      errors: [
        {
          message:
            'Translation key "whitespace_only" has an empty string value. Translation values should not be empty.',
          line: 2,
        },
        {
          message:
            'Translation key "tabs_and_spaces" has an empty string value. Translation values should not be empty.',
          line: 3,
        },
        {
          message:
            'Translation key "newlines_only" has an empty string value. Translation values should not be empty.',
          line: 4,
        },
      ],
    },
    {
      filename: 'test.json',
      code: JSON.stringify(
        {
          welcome: {
            title: '',
            subtitle: 'Welcome',
          },
        },
        null,
        2
      ),
      errors: [
        {
          message:
            'Translation key "title" has an empty string value. Translation values should not be empty.',
          line: 3,
        },
      ],
    },
  ],
};

ruleTester.run('no-empty-translation-string', rule, cases);
