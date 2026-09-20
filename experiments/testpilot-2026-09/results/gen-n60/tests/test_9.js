let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.number', function(done) {
        // basic number parsing
        const numSchema = zod.z.number();
        assert.strictEqual(numSchema.parse(42), 42);
        assert.throws(() => numSchema.parse('42'), /Expected number/);

        // integer validation
        const intSchema = zod.z.number().int();
        assert.strictEqual(intSchema.parse(10), 10);
        assert.throws(() => intSchema.parse(10.5), /Expected integer/);

        // max validation
        const maxSchema = zod.z.number().max(5);
        assert.strictEqual(maxSchema.parse(5), 5);
        assert.throws(() => maxSchema.parse(6), /Number must be less than or equal to 5/);

        // safe (behaves like int in Zod 3)
        const safeSchema = zod.z.number().safe();
        assert.strictEqual(safeSchema.parse(3), 3);
        assert.throws(() => safeSchema.parse(3.14), /Expected integer/);

        done();
    });
});