let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.coerce.number', function(done) {
        // Create a coerced number schema
        const schema = zod.z.coerce.number();

        // Valid coercions
        assert.strictEqual(schema.parse("123"), 123);
        assert.strictEqual(schema.parse("45.67"), 45.67);
        assert.strictEqual(schema.parse(89), 89);

        // Invalid coercion should throw
        assert.throws(() => schema.parse("not a number"));

        done();
    });
});