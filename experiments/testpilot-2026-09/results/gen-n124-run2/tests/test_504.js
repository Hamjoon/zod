let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.custom', function(done) {
        // custom schema that only accepts strings
        const stringOnly = zod.z.custom((val) => typeof val === 'string');

        // should parse a string without throwing
        assert.doesNotThrow(() => {
            const result = stringOnly.parse('hello');
            assert.strictEqual(result, 'hello');
        });

        // should throw for a non‑string value
        assert.throws(() => {
            stringOnly.parse(123);
        });

        // when no function is supplied, it defaults to a validator that always returns true
        const anyValue = zod.z.custom();

        // any value should be accepted
        assert.doesNotThrow(() => {
            const result = anyValue.parse(456);
            assert.strictEqual(result, 456);
        });
        assert.doesNotThrow(() => {
            const result = anyValue.parse({ foo: 'bar' });
            assert.deepStrictEqual(result, { foo: 'bar' });
        });

        done();
    });
});