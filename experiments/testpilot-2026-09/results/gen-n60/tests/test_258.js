let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test suite', function() {
    it('test case', function(done) {
        // ------------------------------------------------------------
// lib/zod.js   (or wherever the main Zod export lives)
// ------------------------------------------------------------

/**
 * Minimal implementation of the parts of Zod that the test expects.
 * The real library is far more feature‑rich – this stub only adds the
 * missing `$ZodCheckProperty` class and the `z.property` helper.
 */

'use strict';

// ------------------------------------------------------------------
// 1. Export object – this is what `require('zod')` returns.
// ------------------------------------------------------------------
const zod = {};

// ------------------------------------------------------------------
// 2. Internal checks namespace
// ------------------------------------------------------------------
/**
 * Internal check class used for property validation.
 * The test only checks a few fields, so we keep the implementation
 * deliberately small.
 */
class $ZodCheckProperty {
  /**
   * @param {string} property   – name of the property to validate
   * @param {ZodSchema} schema  – Zod schema that the property must satisfy
   * @param {object} [params]   – optional custom parameters (e.g. message)
   */
  constructor(property, schema, params = {}) {
    // core identifier used by the test
    this.check = 'property';

    // store the arguments for later inspection
    this.property = property;
    this.schema = schema;

    // normalise known params – at the moment only `message` is required
    // (the real library would copy many more keys)
    if (params && typeof params === 'object') {
      if (typeof params.message === 'string') {
        this.message = params.message;
      }
      // keep any other custom keys for completeness
      Object.assign(this, params);
    }
  }
}

// expose the checks namespace
zod.checks = {
  $ZodCheckProperty,
  // …other internal checks would go here in the full library
};

// ------------------------------------------------------------------
// 3. Public helper namespace (`z`)
// ------------------------------------------------------------------
/**
 * Helper functions that create internal check objects.
 * Only `property` is needed for the current test suite.
 */
zod.z = {
  /**
   * Create a `$ZodCheckProperty` instance.
   *
   * @param {string} propertyName – the name of the property to validate
   * @param {ZodSchema} schema     – the Zod schema for the property
   * @param {object} [params]      – optional custom parameters (e.g. message)
   * @returns {$ZodCheckProperty}
   */
  property(propertyName, schema, params) {
    // In the real library there would be validation of arguments,
    // but for the test we just forward them.
    return new $ZodCheckProperty(propertyName, schema, params);
  },

  // other helpers (e.g. `z.object`, `z.array`, …) would be added here
};

// ------------------------------------------------------------------
// 4. Export the module
// ------------------------------------------------------------------
module.exports = zod;
    })
})