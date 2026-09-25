let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.partialRecord', function(done) {
        // usage #1
        const Keys = zod.enum(["id", "name", "email"]);
        const Person = zod.partialRecord(Keys, zod.string());

        // valid parses
        assert.deepStrictEqual(Person.parse({}), {});
        assert.deepStrictEqual(Person.parse({ id: "123" }), { id: "123" });
        assert.deepStrictEqual(Person.parse({ name: "Alice", email: "alice@example.com" }), {
            name: "Alice",
            email: "alice@example.com"
        });

        // invalid key should throw
        assert.throws(() => Person.parse({ unknown: "value" }), /Invalid/);

        // usage #2
        const MyRecord = zod.partialRecord(zod.enum(["a", "b", "c"]), zod.number());

        // valid parses
        assert.deepStrictEqual(MyRecord.parse({}), {});
        assert.deepStrictEqual(MyRecord.parse({ a: 1, c: 3 }), { a: 1, c: 3 });

        // invalid key should throw
        assert.throws(() => MyRecord.parse({ d: 5 }), /Invalid/);

        done();
    });
});