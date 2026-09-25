let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // use the named export `z`

describe('test zod', function () {
    it('test zod.z.gte', function (done) {
        // Create a schema that validates numbers >= 5
        // In Zod the `gte` (greater‑than‑or‑equal) method lives on a *number* schema.
        const schema = z.number().gte(5);

        // Helper to run validation using the current Zod API (parse)
        const runValidation = (value) => {
            // `parse` throws on failure, otherwise returns the value
            return schema.parse(value);
        };

        // Values that should pass
        assert.doesNotThrow(() => runValidation(5), '5 should be valid (equal to 5)');
        assert.doesNotThrow(() => runValidation(10), '10 should be valid (greater than 5)');

        // Values that should fail
        assert.throws(() => runValidation(4), /.+/, '4 should be invalid (less than 5)');

        done();
    });
});