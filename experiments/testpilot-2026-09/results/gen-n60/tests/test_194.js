let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.catch', function(done) {
        const z = zod.z;

        // 1️⃣ static catch value
        const staticCatch = z.number().catch(42);
        assert.strictEqual(staticCatch.parse(5), 5, 'valid number should be returned unchanged');
        assert.strictEqual(staticCatch.parse('tuna'), 42, 'invalid input should return static catch value');

        // 2️⃣ functional catch value – receives the ZodError directly
        let fnCalled = false;
        const fnCatch = z.number().catch((error) => {
            fnCalled = true;
            // `error` should be a ZodError instance
            assert(error instanceof zod.ZodError, 'error must be a ZodError');
            // return a deterministic fallback
            return 99;
        });
        assert.strictEqual(fnCatch.parse('invalid'), 99, 'invalid input should invoke catch function');
        assert(fnCalled, 'catch function should have been called');

        // 3️⃣ catch function is invoked on each parse (demonstrate non‑deterministic fallback)
        const randomCatch = z.number().catch(() => Math.random());
        const first = randomCatch.parse('oops');
        const second = randomCatch.parse('oops');
        // The two values should be numbers and (very likely) different
        assert.strictEqual(typeof first, 'number');
        assert.strictEqual(typeof second, 'number');
        // It's possible (though extremely unlikely) that they are equal; we only assert they are numbers
        // and that the function was indeed called (by checking they are not the original input)
        assert.notStrictEqual(first, 'oops');
        assert.notStrictEqual(second, 'oops');

        done();
    });
});