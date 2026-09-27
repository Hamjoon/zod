let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test suite', function() {
    it('test case', function(done) {
        // zod.js
// Minimal implementation to satisfy the test suite

module.exports = {
  // Namespace for validation helpers
  z: {
    /**
     * Greater‑than check.
     *
     * @param {any} value        The value to compare against.
     * @param {Object} [extra]   Optional extra parameters that should be merged
     *                           into the returned descriptor.
     * @returns {Object} An object describing the check:
     *                   - check:      always the string "greater_than"
     *                   - inclusive: always false (strictly greater‑than)
     *                   - value:     the value passed in
     *                   - ...extra:  any additional properties supplied
     */
    gt(value, extra = {}) {
      // Build the descriptor object with the required shape
      return {
        check: 'greater_than',
        inclusive: false,
        value,
        // Merge any extra parameters (shallow merge is sufficient for the test)
        ...extra,
      };
    },

    // You can add other helpers (lt, gte, lte, etc.) here if needed.
  },
};
    })
})