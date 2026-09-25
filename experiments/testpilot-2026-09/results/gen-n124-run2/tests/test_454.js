let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.catch', function(done) {
        // Simple catch with a static fallback value
        const staticCatchSchema = zod.z.catch(zod.z.string(), 'fallback');
        // Valid input should pass through unchanged
        assert.strictEqual(staticCatchSchema.parse('hello'), 'hello');
        // Invalid input should return the fallback value
        assert.strictEqual(staticCatchSchema.parse(123), 'fallback');

        // Catch with a function that returns a value
        let callCount = 0;
        const fnCatchSchema = zod.z.catch(zod.z.number(), () => {
            callCount++;
            return 42;
        });
        // Valid number should be parsed normally
        assert.strictEqual(fnCatchSchema.parse(7), 7);
        // Invalid input should invoke the function and return its result
        assert.strictEqual(fnCatchSchema.parse('not a number'), 42);
        // Ensure the function was called exactly once for the invalid parse
        assert.strictEqual(callCount, 1);

        done();
    });
});