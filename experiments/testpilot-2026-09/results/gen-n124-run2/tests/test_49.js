let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.coerce.bigint', function(done) {
        // basic coercion from string
        const schemaFromString = zod.z.coerce.bigint();
        const resultString = schemaFromString.parse("123");
        assert.strictEqual(resultString, 123n, "Should coerce numeric string to bigint");

        // basic coercion from number
        const schemaFromNumber = zod.z.coerce.bigint();
        const resultNumber = schemaFromNumber.parse(456);
        assert.strictEqual(resultNumber, 456n, "Should coerce number to bigint");

        // already a bigint passes through unchanged
        const schemaFromBigInt = zod.z.coerce.bigint();
        const resultBigInt = schemaFromBigInt.parse(789n);
        assert.strictEqual(resultBigInt, 789n, "Should return the same bigint");

        // invalid coercion should throw a ZodError
        const schemaInvalid = zod.z.coerce.bigint();
        assert.throws(() => schemaInvalid.parse("not-a-number"), /ZodError/, "Invalid string should throw");

        // coercion combined with validation (min)
        const schemaMin = zod.z.coerce.bigint().min(10n);
        assert.strictEqual(schemaMin.parse("10"), 10n, "String '10' should pass min(10n)");
        assert.throws(() => schemaMin.parse("5"), /ZodError/, "Value below min should throw");

        // coercion combined with multipleOf
        const schemaMultiple = zod.z.coerce.bigint().multipleOf(5n);
        assert.strictEqual(schemaMultiple.parse("15"), 15n, "15 is a multiple of 5");
        assert.throws(() => schemaMultiple.parse("14"), /ZodError/, "14 is not a multiple of 5");

        done();
    });
});