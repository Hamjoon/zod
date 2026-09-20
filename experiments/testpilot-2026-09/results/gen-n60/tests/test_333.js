let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.parseAsync', function(done) {
        // Schema with an async refinement (value length must be <= 8)
        const asyncRefineSchema = zod.string().refine(async (val) => {
            // Simulate async work
            return val.length <= 8;
        });

        // First, parse a value that satisfies the async refinement
        zod.z.parseAsync(asyncRefineSchema, "hello")
            .then((result) => {
                assert.strictEqual(result, "hello");

                // Then, parse a plain string schema without any refinements
                return zod.z.parseAsync(zod.string(), "world");
            })
            .then((result2) => {
                assert.strictEqual(result2, "world");
                done();
            })
            .catch(done);
    });
});