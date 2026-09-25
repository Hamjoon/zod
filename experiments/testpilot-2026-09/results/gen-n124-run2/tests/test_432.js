let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nullish', function(done) {
        // nullish with a string inner type
        const stringSchema = zod.z.nullish(zod.z.string());
        // valid values
        assert.strictEqual(stringSchema.parse('hello'), 'hello');
        assert.strictEqual(stringSchema.parse(null), null);
        assert.strictEqual(stringSchema.parse(undefined), undefined);
        // invalid values
        assert.throws(() => stringSchema.parse(123), /Expected string/);
        assert.throws(() => stringSchema.parse(true), /Expected string/);

        // nullish with a number inner type
        const numberSchema = zod.z.nullish(zod.z.number());
        assert.strictEqual(numberSchema.parse(42), 42);
        assert.strictEqual(numberSchema.parse(null), null);
        assert.strictEqual(numberSchema.parse(undefined), undefined);
        assert.throws(() => numberSchema.parse('not a number'), /Expected number/);

        // nullish with a constrained inner type (integer)
        const intSchema = zod.z.nullish(zod.z.number().int());
        assert.strictEqual(intSchema.parse(5), 5);
        assert.strictEqual(intSchema.parse(null), null);
        assert.strictEqual(intSchema.parse(undefined), undefined);
        assert.throws(() => intSchema.parse(5.5), /Expected integer/);

        done();
    });
});