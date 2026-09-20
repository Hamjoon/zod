let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');

describe('test zod', function () {
    it('test zod.z.number', function (done) {
        // basic number parsing
        const numSchema = z.number();
        assert.strictEqual(numSchema.parse(42), 42);
        // Zod throws a ZodError whose stringified form contains "expected number"
        assert.throws(() => numSchema.parse('42'), /expected number/i);

        // integer validation
        const intSchema = z.number().int();
        assert.strictEqual(intSchema.parse(10), 10);
        // error message contains "expected integer"
        assert.throws(() => intSchema.parse(10.5), /expected integer/i);

        // max validation
        const maxSchema = z.number().max(5);
        assert.strictEqual(maxSchema.parse(5), 5);
        assert.throws(() => maxSchema.parse(6), /Number must be less than or equal to 5/);

        // safe (ensures a safe integer)
        const safeSchema = z.number().safe();
        assert.strictEqual(safeSchema.parse(3), 3);
        // error message for non‑safe integer
        assert.throws(() => safeSchema.parse(3.14), /Number must be a safe integer/);

        done();
    });
});