/**
 * @fileoverview Disallow empty strings in translation values
 * @author eslint-plugin-i18next
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * Check if a value is an empty string
 * @param {*} value - The value to check
 * @returns {boolean}
 */
function isEmptyString(value) {
  return typeof value === 'string' && value.trim() === '';
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow empty strings in translation values',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          ignoreKeys: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of key patterns to ignore',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const ignoreKeys = options.ignoreKeys || [];

    /**
     * Check if a key should be ignored based on ignore patterns
     * @param {string} key - The key to check
     * @returns {boolean}
     */
    function shouldIgnoreKey(key) {
      return ignoreKeys.some(pattern => {
        if (typeof pattern === 'string') {
          return key.includes(pattern);
        }
        return false;
      });
    }

    return {
      JSONProperty(node) {
        // Only process JSON files (translation files)
        const filename = context.getFilename();
        if (!filename.endsWith('.json')) {
          return;
        }

        // Get the key name
        let key = '';
        if (node.key.type === 'JSONLiteral') {
          key = node.key.value;
        } else if (node.key.type === 'Literal') {
          key = node.key.value;
        } else if (node.key.type === 'Identifier') {
          key = node.key.name;
        }

        // Skip if not a string key or should be ignored
        if (typeof key !== 'string' || shouldIgnoreKey(key)) {
          return;
        }

        // Get the translation value - only check string literals
        let value;
        if (node.value.type === 'JSONLiteral') {
          value = node.value.value;
        } else if (node.value.type === 'Literal') {
          value = node.value.value;
        } else {
          // Skip non-literal values (objects, arrays, etc.)
          return;
        }

        // Check if the translation value is an empty string
        if (isEmptyString(value)) {
          context.report({
            node: node.value,
            message: `Translation key "${key}" has an empty string value. Translation values should not be empty.`,
            data: {
              key,
            },
          });
        }
      },
    };
  },
};
