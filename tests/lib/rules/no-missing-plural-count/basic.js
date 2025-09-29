const RuleTester = require('eslint').RuleTester;
const rule = require('../../../../lib/rules/no-missing-plural-count');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'script',
    parser: require('espree'),
  },
});

const cases = {
  valid: [
    // Valid plural keys with {count} parameter
    {
      filename: 'test.json',
      code: JSON.stringify(
        {
          items_one: 'You have {count} item',
          items_other: 'You have {count} items',
        },
        null,
        2
      ),
    },
    {
      filename: 'test.json',
      code: JSON.stringify(
        {
          users_zero: 'No users',
          users_one: 'One user: {count}',
          users_few: '{count} users',
          users_many: 'Many users: {count}',
          users_other: '{count} users total',
        },
        null,
        2
      ),
    },
    // Non-plural keys should be ignored
    {
      filename: 'test.json',
      code: JSON.stringify(
        {
          welcome: 'Welcome',
          hello_world: 'Hello World',
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
          ignore_me_one: 'This should be ignored',
        },
        null,
        2
      ),
      options: [{ ignoreKeys: ['ignore_me'] }],
    },
  ],
  invalid: [
    // Missing {count} in plural keys
    {
      filename: 'test.json',
      code: JSON.stringify(
        {
          items_one: 'You have 1 item',
          items_other: 'You have many items',
        },
        null,
        2
      ),
      errors: [
        {
          message:
            'Plural key "items_one" is missing {count} parameter. Plural forms should include the count placeholder.',
          line: 2,
        },
        {
          message:
            'Plural key "items_other" is missing {count} parameter. Plural forms should include the count placeholder.',
          line: 3,
        },
      ],
    },
    {
      filename: 'test.json',
      code: JSON.stringify(
        {
          users_zero: 'No users found',
          users_few: 'A few users',
          users_many: 'Lots of users',
        },
        null,
        2
      ),
      errors: [
        {
          message:
            'Plural key "users_zero" is missing {count} parameter. Plural forms should include the count placeholder.',
        },
        {
          message:
            'Plural key "users_few" is missing {count} parameter. Plural forms should include the count placeholder.',
        },
        {
          message:
            'Plural key "users_many" is missing {count} parameter. Plural forms should include the count placeholder.',
        },
      ],
    },
  ],
};

ruleTester.run('no-missing-plural-count', rule, cases);
