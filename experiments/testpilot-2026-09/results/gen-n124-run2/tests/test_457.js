let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.catch', function(done) {
        // ---- static catch value ----
        const numberWithCatch = zod.number().catch(42);
        // valid number should pass through unchanged
        assert.strictEqual(numberWithCatch.parse(5), 5);
        // invalid input should be replaced by the catch value
        assert.strictEqual(numberWithCatch.parse("tuna"), 42);

        // ---- functional catch ----
        const numberWithFuncCatch = zod.number().catch((ctx) => {
            // the context should contain the original ZodError
            assert(ctx.error instanceof zod.ZodError);
            // return a deterministic fallback value for testing
            return 99;
        });
        // invalid input triggers the function and returns the fallback
        assert.strictEqual(numberWithFuncCatch.parse("sup"), 99);
        // valid input still parses normally
        assert.strictEqual(numberWithFuncCatch.parse(7), 7);

        done();
    });
});