let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.catch', function (done) {
        // ---- static catch value ----
        const staticCatch = zod.number().catch(42);
        // valid input should be returned unchanged
        assert.strictEqual(staticCatch.parse(5), 5);
        // invalid input should fall back to the catch value
        assert.strictEqual(staticCatch.parse('tuna'), 42);

        // ---- functional catch value (receives the ZodError directly) ----
        let callCount = 0;
        const funcCatch = zod.number().catch((error) => {
            // The argument is the ZodError that was thrown
            assert(error instanceof zod.ZodError);
            callCount++;
            // Return a value that changes with each call to prove the function runs each time
            return callCount * 10;
        });

        // Each invalid parse should invoke the catch function and return the computed value
        assert.strictEqual(funcCatch.parse('a'), 10);
        assert.strictEqual(funcCatch.parse('b'), 20);
        assert.strictEqual(funcCatch.parse('c'), 30);
        // Ensure the catch function was called exactly three times
        assert.strictEqual(callCount, 3);

        done();
    });
});