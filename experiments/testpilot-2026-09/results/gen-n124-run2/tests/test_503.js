let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.custom', function(done) {
        // 1. When no function is supplied, the default validator always returns true.
        const anySchema = zod.z.custom(undefined);
        assert.doesNotThrow(() => anySchema.parse('anything'));
        assert.doesNotThrow(() => anySchema.parse(123));
        assert.doesNotThrow(() => anySchema.parse({ foo: 'bar' }));

        // 2. Provide a custom validator that only accepts even numbers.
        const isEven = (val) => typeof val === 'number' && val % 2 === 0;
        const evenSchema = zod.z.custom(isEven);

        // Should succeed for an even number.
        assert.doesNotThrow(() => evenSchema.parse(42));

        // Should fail for an odd number.
        assert.throws(() => evenSchema.parse(7), /Invalid input/);

        // Should also fail for non‑number types.
        assert.throws(() => evenSchema.parse('not a number'), /Invalid input/);

        done();
    });
});