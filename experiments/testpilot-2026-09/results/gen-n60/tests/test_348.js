let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.coerce.boolean (custom Boolean coercion)', function (done) {
        // Use a preprocess that applies JavaScript's Boolean conversion to any value,
        // then validates that the result is a boolean.
        const schema = zod.z.preprocess((val) => Boolean(val), zod.z.boolean());

        // Truthy values should coerce to true
        assert.strictEqual(schema.parse("tuna"), true);
        assert.strictEqual(schema.parse("true"), true);
        assert.strictEqual(schema.parse(1), true);
        assert.strictEqual(schema.parse([]), true);
        assert.strictEqual(schema.parse({}), true);
        assert.strictEqual(schema.parse([1, 2, 3]), true);
        assert.strictEqual(schema.parse("non‑empty string"), true);

        // Falsy values should coerce to false
        assert.strictEqual(schema.parse("false"), false);
        assert.strictEqual(schema.parse(0), false);
        assert.strictEqual(schema.parse(""), false);
        assert.strictEqual(schema.parse(undefined), false);
        assert.strictEqual(schema.parse(null), false);
        assert.strictEqual(schema.parse(NaN), false);
        assert.strictEqual(schema.parse(false), false);

        done();
    });
});