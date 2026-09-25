let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.unknown', function(done) {
        // basic unknown schema should accept any value unchanged
        const unknownSchema = zod.z.unknown();

        // primitive values
        assert.strictEqual(unknownSchema.parse(42), 42);
        assert.strictEqual(unknownSchema.parse('hello'), 'hello');
        assert.strictEqual(unknownSchema.parse(true), true);
        assert.strictEqual(unknownSchema.parse(null), null);
        assert.strictEqual(unknownSchema.parse(undefined), undefined);

        // objects and arrays
        const obj = { a: 1, b: 'x' };
        const arr = [1, 2, 3];
        assert.deepStrictEqual(unknownSchema.parse(obj), obj);
        assert.deepStrictEqual(unknownSchema.parse(arr), arr);

        // safeParse should also succeed for any value
        const safeResult = unknownSchema.safeParse({ foo: 'bar' });
        assert.strictEqual(safeResult.success, true);
        assert.deepStrictEqual(safeResult.data, { foo: 'bar' });

        // refine can be used to narrow at runtime
        const stringOnly = zod.z.unknown().refine(val => typeof val === 'string');
        assert.strictEqual(stringOnly.parse('a string'), 'a string');
        assert.throws(() => stringOnly.parse(123), /Invalid input/);

        done();
    });
});