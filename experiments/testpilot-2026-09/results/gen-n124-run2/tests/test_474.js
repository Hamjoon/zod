let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.readonly', function(done) {
        // create a simple inner schema
        const inner = zod.z.string();

        // wrap it with zod.z.readonly
        const schema = zod.z.readonly(inner);

        // verify the internal definition
        assert.strictEqual(schema._def.type, 'readonly');
        assert.strictEqual(schema._def.innerType, inner);

        // parsing a valid value should succeed and return the same value
        const valid = 'hello world';
        assert.strictEqual(schema.parse(valid), valid);

        // parsing an invalid value should throw
        assert.throws(() => schema.parse(123), /Invalid/);

        done();
    });
});