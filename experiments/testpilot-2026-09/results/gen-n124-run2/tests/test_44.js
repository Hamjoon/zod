let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.coerce.boolean', function(done) {
        const schema = zod.z.coerce.boolean();

        // Truthy values should coerce to true
        assert.strictEqual(schema.parse("tuna"), true, '"tuna" should be true');
        assert.strictEqual(schema.parse("true"), true, '"true" should be true');
        assert.strictEqual(schema.parse("false"), true, '"false" should be true');
        assert.strictEqual(schema.parse(1), true, '1 should be true');
        assert.strictEqual(schema.parse([]), true, '[] should be true');

        // Falsy values should coerce to false
        assert.strictEqual(schema.parse(0), false, '0 should be false');
        assert.strictEqual(schema.parse(""), false, 'empty string should be false');
        assert.strictEqual(schema.parse(undefined), false, 'undefined should be false');
        assert.strictEqual(schema.parse(null), false, 'null should be false');

        done();
    });
});