let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.partialRecord', function(done) {
        // usage #1
        const Keys = zod.enum(["id", "name", "email"]).or(zod.never());
        const Person = zod.partialRecord(Keys, zod.string());

        // Should accept empty object
        assert.deepStrictEqual(Person.parse({}), {});

        // Should accept any subset of the defined keys
        assert.deepStrictEqual(Person.parse({ id: "123" }), { id: "123" });
        assert.deepStrictEqual(Person.parse({ name: "Alice", email: "a@b.c" }), { name: "Alice", email: "a@b.c" });

        // Should reject unknown keys
        assert.throws(() => Person.parse({ unknown: "value" }), /Invalid key/);

        // usage #2
        const MyRecord = zod.partialRecord(zod.enum(["a", "b", "c"]), zod.number());

        // Accept empty object
        assert.deepStrictEqual(MyRecord.parse({}), {});

        // Accept subset with correct value types
        assert.deepStrictEqual(MyRecord.parse({ a: 1, c: 3 }), { a: 1, c: 3 });

        // Reject wrong value type (adjusted regex to match actual error message)
        assert.throws(() => MyRecord.parse({ b: "not a number" }), /expected number/);

        // Reject unknown keys
        assert.throws(() => MyRecord.parse({ d: 4 }), /Invalid key/);

        done();
    });
});