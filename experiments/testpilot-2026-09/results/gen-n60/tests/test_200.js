let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nonoptional', function(done) {
        // Create a nonoptional string schema
        const nonOptString = zod.z.nonoptional(zod.string());

        // Valid parsing should succeed and return the original value
        const parsed = nonOptString.parse('hello world');
        assert.strictEqual(parsed, 'hello world');

        // Parsing undefined should throw (nonoptional should reject undefined)
        assert.throws(() => nonOptString.parse(undefined), /Required|undefined/);

        // safeParse should indicate failure for undefined
        const safeResult = nonOptString.safeParse(undefined);
        assert.strictEqual(safeResult.success, false);

        // safeParse should also fail for a wrong type (e.g., number)
        const wrongTypeResult = nonOptString.safeParse(123);
        assert.strictEqual(wrongTypeResult.success, false);

        // Nonoptional of a number schema should behave similarly
        const nonOptNumber = zod.z.nonoptional(zod.number());
        assert.strictEqual(nonOptNumber.parse(42), 42);
        assert.throws(() => nonOptNumber.parse(undefined), /Required|undefined/);
        const numSafe = nonOptNumber.safeParse(undefined);
        assert.strictEqual(numSafe.success, false);

        done();
    });
});