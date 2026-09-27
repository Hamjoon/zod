let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.partialRecord', function(done) {
        // Create a partialRecord schema where the only allowed key is the literal string 'foo'
        // and its value must be a string. All keys are optional, so an empty object is valid.
        const schema = zod.z.partialRecord(zod.z.literal('foo'), zod.z.string());

        // 1. Empty object should be valid
        assert.deepStrictEqual(schema.parse({}), {});

        // 2. Object with the allowed key and correct value type should be valid
        assert.deepStrictEqual(schema.parse({ foo: 'hello' }), { foo: 'hello' });

        // 3. Object with an unexpected key should throw a validation error
        assert.throws(() => {
            schema.parse({ bar: 'test' });
        });

        // 4. Object with the allowed key but wrong value type should also throw
        assert.throws(() => {
            schema.parse({ foo: 123 });
        });

        done();
    });
});