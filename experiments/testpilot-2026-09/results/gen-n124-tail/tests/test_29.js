let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.overwrite', function (done) {
        // Arrange: create a dummy transaction object
        const tx = { id: 123, data: 'sample' };

        // Act: invoke the overwrite function
        const result = zod.z.overwrite(tx);

        // Assert: result should be a non‑null object
        assert.ok(result, 'Result should be truthy');

        // Assert: the returned object should carry the original transaction reference
        assert.strictEqual(result.tx, tx, 'tx property should reference the original transaction object');

        // Optional: verify that the constructor name indicates the correct check type
        if (result.constructor && result.constructor.name) {
            assert.ok(
                result.constructor.name.includes('ZodCheckOverwrite'),
                `Constructor name should include "ZodCheckOverwrite", got "${result.constructor.name}"`
            );
        }

        // If the library exposes the check type via a different property (e.g., `type` or `_def.check`),
        // you can add an additional assertion here. For example:
        // assert.strictEqual(result.type, 'overwrite', 'type property should be "overwrite"');
        // or:
        // assert.strictEqual(result._def?.check, 'overwrite', 'internal check should be "overwrite"');

        done();
    });
});