let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.enum', function(done) {
        // 1️⃣ Enum created from an array of strings
        const Color = zod.z.enum(['Red', 'Green']);
        // parsing a valid enum value should succeed and return the same value
        assert.strictEqual(Color.parse('Red'), 'Red');
        // parsing an invalid value should throw a ZodError
        assert.throws(() => Color.parse('Blue'), /Invalid enum value/);
        // internal definition should contain entries mapping each string to itself
        assert.deepStrictEqual(Color._def.entries, { Red: 'Red', Green: 'Green' });

        // 2️⃣ Enum created from an object (value → value mapping)
        const Status = zod.z.enum({ ok: 0, fail: 1 });
        // valid values are accepted
        assert.strictEqual(Status.parse(0), 0);
        assert.strictEqual(Status.parse(1), 1);
        // an unknown value should throw
        assert.throws(() => Status.parse(2), /Invalid enum value/);
        // internal entries should be exactly the object that was supplied
        assert.deepStrictEqual(Status._def.entries, { ok: 0, fail: 1 });

        done();
    });
});