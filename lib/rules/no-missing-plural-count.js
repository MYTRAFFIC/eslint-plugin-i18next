/**
 * @fileoverview Validate that plural translation keys contain {count} parameter
 * @author sebdiem
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const PLURAL_SUFFIXES = ['_zero', '_one', '_two', '_few', '_many', '_other'];

/**
 * Check if a key is a plural key
 * @param {string} key - The translation key
 * @returns {boolean}
 */
function isPluralKey(key) {
  return PLURAL_SUFFIXES.some(suffix => key.endsWith(suffix));
}

/**
 * Check if a translation value contains {count} parameter
 * @param {string} value - The translation value
 * @returns {boolean}
 */
function hasCountParameter(value) {
  if (typeof value !== 'string') {
    return false;
  }
  return value.includes('{count}');
}

/**
 * Get the base key from a plural key
 * @param {string} pluralKey - The plural key (e.g., "items_one")
 * @returns {string} The base key (e.g., "items")
 */
function getBaseKey(pluralKey) {
  for (const suffix of PLURAL_SUFFIXES) {
    if (pluralKey.endsWith(suffix)) {
      return pluralKey.slice(0, -suffix.length);
    }
  }
  return pluralKey;
}

/**
 * Get the plural suffix from a plural key
 * @param {string} pluralKey - The plural key (e.g., "items_one")
 * @returns {string} The suffix (e.g., "_one")
 */
function getPluralSuffix(pluralKey) {
  for (const suffix of PLURAL_SUFFIXES) {
    if (pluralKey.endsWith(suffix)) {
      return suffix;
    }
  }
  return '';
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow plural translation keys without {count} parameter',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: null, // or "code" or "whitespace"
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

        // Check if this is a plural key
        if (!isPluralKey(key)) {
          return;
        }

        // Get the translation value
        let value = '';
        if (node.value.type === 'JSONLiteral') {
          value = node.value.value;
        } else if (node.value.type === 'Literal') {
          value = node.value.value;
        }

        // Check if the plural translation has {count} parameter
        if (!hasCountParameter(value)) {
          const baseKey = getBaseKey(key);
          const suffix = getPluralSuffix(key);

          context.report({
            node: node.value,
            message: `Plural key "${key}" is missing {count} parameter. Plural forms should include the count placeholder.`,
            data: {
              key,
              baseKey,
              suffix: suffix.slice(1), // Remove leading underscore for display
            },
          });
        }
      },
    };
  },
};
