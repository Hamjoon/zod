let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.strictObject', function(done) {
        // Define a strict object schema with two required fields
        const schema = zod.z.strictObject({
            name: zod.z.string(),
            age: zod.z.number()
        });

        // 1️⃣ Valid object should parse without error
        const valid = { name: 'Alice', age: 30 };
        const parsed = schema.parse(valid);
        assert.deepStrictEqual(parsed, valid);

        // 2️⃣ Object containing an unknown key should throw
        assert.throws(() => {
            schema.parse({ name: 'Bob', age: 25, extra: true });
        }, /Unrecognized key|unknown key|unexpected key/i);

        // 3️⃣ Object missing a required key should also throw
        assert.throws(() => {
            schema.parse({ name: 'Bob' });
        }, /Required|missing/i);

        done();
    });
});