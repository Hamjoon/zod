let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.bigint', function(done) {
        const { bigint, toJSONSchema } = zod;

        // basic validation
        assert.strictEqual(bigint().parse(10n), 10n);
        assert.throws(() => bigint().parse(10));

        // gt
        assert.strictEqual(bigint().gt(5n).parse(6n), 6n);
        assert.throws(() => bigint().gt(5n).parse(5n));

        // gte (alias min)
        assert.strictEqual(bigint().gte(5n).parse(5n), 5n);
        assert.throws(() => bigint().gte(5n).parse(4n));

        // lt
        assert.strictEqual(bigint().lt(10n).parse(9n), 9n);
        assert.throws(() => bigint().lt(10n).parse(10n));

        // lte (alias max)
        assert.strictEqual(bigint().lte(10n).parse(10n), 10n);
        assert.throws(() => bigint().lte(10n).parse(11n));

        // positive
        assert.strictEqual(bigint().positive().parse(1n), 1n);
        assert.throws(() => bigint().positive().parse(0n));

        // nonnegative
        assert.strictEqual(bigint().nonnegative().parse(0n), 0n);
        assert.throws(() => bigint().nonnegative().parse(-1n));

        // negative
        assert.strictEqual(bigint().negative().parse(-1n), -1n);
        assert.throws(() => bigint().negative().parse(0n));

        // nonpositive
        assert.strictEqual(bigint().nonpositive().parse(0n), 0n);
        assert.throws(() => bigint().nonpositive().parse(1n));

        // multipleOf
        assert.strictEqual(bigint().multipleOf(5n).parse(15n), 15n);
        assert.throws(() => bigint().multipleOf(5n).parse(14n));

        // toJSONSchema should throw for bigint schemas
        assert.throws(() => toJSONSchema(bigint()));

        done();
    });
});