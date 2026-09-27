let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.strictObject', function(done) {
        // Define a strict object schema with a single required string property
        const StrictPerson = zod.z.strictObject({
            name: zod.z.string(),
        });

        // Valid object should parse without error
        const parsed = StrictPerson.parse({ name: "Alice" });
        assert.deepStrictEqual(parsed, { name: "Alice" });

        // Object with an extra key should throw
        assert.throws(() => {
            StrictPerson.parse({ name: "Bob", extraKey: true });
        }, /Unrecognized key/);

        // Object missing a required key should also throw
        assert.throws(() => {
            StrictPerson.parse({ });
        }, /Required/);

        done();
    });
});