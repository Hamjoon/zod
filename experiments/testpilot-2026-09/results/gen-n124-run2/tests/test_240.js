let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.bigint', function(done) {
        // basic bigint schema parses a bigint
        const baseSchema = zod.z.bigint();
        assert.doesNotThrow(() => baseSchema.parse(10n));

        // .gt() (greater than)
        const gtSchema = zod.z.bigint().gt(5n);
        assert.doesNotThrow(() => gtSchema.parse(6n));
        assert.throws(() => gtSchema.parse(5n));

        // .gte() (greater than or equal, alias of .min())
        const gteSchema = zod.z.bigint().gte(5n);
        assert.doesNotThrow(() => gteSchema.parse(5n));
        assert.doesNotThrow(() => gteSchema.parse(6n));
        assert.throws(() => gteSchema.parse(4n));

        // .lt() (less than)
        const ltSchema = zod.z.bigint().lt(10n);
        assert.doesNotThrow(() => ltSchema.parse(9n));
        assert.throws(() => ltSchema.parse(10n));

        // .lte() (less than or equal, alias of .max())
        const lteSchema = zod.z.bigint().lte(10n);
        assert.doesNotThrow(() => lteSchema.parse(10n));
        assert.doesNotThrow(() => lteSchema.parse(9n));
        assert.throws(() => lteSchema.parse(11n));

        // .positive() (> 0)
        const posSchema = zod.z.bigint().positive();
        assert.doesNotThrow(() => posSchema.parse(1n));
        assert.throws(() => posSchema.parse(0n));
        assert.throws(() => posSchema.parse(-1n));

        // .nonnegative() (>= 0)
        const nonNegSchema = zod.z.bigint().nonnegative();
        assert.doesNotThrow(() => nonNegSchema.parse(0n));
        assert.doesNotThrow(() => nonNegSchema.parse(5n));
        assert.throws(() => nonNegSchema.parse(-1n));

        // .negative() (< 0)
        const negSchema = zod.z.bigint().negative();
        assert.doesNotThrow(() => negSchema.parse(-5n));
        assert.throws(() => negSchema.parse(0n));
        assert.throws(() => negSchema.parse(1n));

        // .nonpositive() (<= 0)
        const nonPosSchema = zod.z.bigint().nonpositive();
        assert.doesNotThrow(() => nonPosSchema.parse(0n));
        assert.doesNotThrow(() => nonPosSchema.parse(-5n));
        assert.throws(() => nonPosSchema.parse(1n));

        // .multipleOf() (evenly divisible)
        const multSchema = zod.z.bigint().multipleOf(5n);
        assert.doesNotThrow(() => multSchema.parse(10n));
        assert.doesNotThrow(() => multSchema.parse(0n));
        assert.throws(() => multSchema.parse(11n));

        // toJSONSchema should throw for bigint schemas
        assert.throws(() => zod.toJSONSchema(zod.z.bigint()));

        done();
    });
});