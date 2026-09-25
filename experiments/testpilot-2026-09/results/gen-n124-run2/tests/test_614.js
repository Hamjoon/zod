let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test suite', function() {
    it('test case', function(done) {
        // ==== zod.js (or the file where the Zod helpers are defined) ====

// If you already have other exports, just merge this in.
const zod = {};

// -------------------------------------------------------------------
// Internal class used for the "size equals" check.
// The constructor stores the size, sets the `check` identifier and
// merges any additional parameters onto the instance.
class $ZodCheckSizeEquals {
  /**
   * @param {number} size – the expected size
   * @param {object} [params={}] – any extra custom parameters
   */
  constructor(size, params = {}) {
    // The identifier the test checks for
    this.check = 'size_equals';

    // The size value itself
    this.size = size;

    // Merge any custom keys (e.g. { customKey: 'customValue' })
    // directly onto the instance so they are accessible as properties.
    Object.assign(this, params);
  }
}

// -------------------------------------------------------------------
// Public API – expose the helper under `zod.z.size`
zod.z = {
  /**
   * Create a size‑equals check.
   *
   * @param {number} size – the expected size
   * @param {object} [params] – optional custom parameters
   * @returns {$ZodCheckSizeEquals} an instance representing the check
   */
  size(size, params) {
    // Simply instantiate the internal class; all required fields are set there.
    return new $ZodCheckSizeEquals(size, params);
  },
};

// -------------------------------------------------------------------
// Export the module (adjust if you already use a different export style)
module.exports = zod;

// If you need to expose the class for debugging/testing you can also export it:
// module.exports.$ZodCheckSizeEquals = $ZodCheckSizeEquals;
    })
})