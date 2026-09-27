let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.optional', function(done) {
        // 1️⃣ Direct optional wrapper
        const optionalString = zod.optional(zod.string());

        // Should accept undefined (i.e., the value is optional)
        assert.doesNotThrow(() => optionalString.parse(undefined));

        // Should accept a valid string and return it unchanged
        const hello = optionalString.parse('hello');
        assert.strictEqual(hello, 'hello');

        // Should reject non‑string values (except undefined)
        // Zod's error message is "Invalid input: expected string, received number"
        // Use a case‑insensitive regex that matches the phrase "expected string"
        assert.throws(() => optionalString.parse(123), /expected string/i);

        // 2️⃣ Optional property inside an object schema
        const Person = zod.object({
            name: zod.string(),
            // `age` is optional – it may be omitted or be a number
            age: zod.optional(zod.number()),
        });

        // Parsing without the optional `age` property should succeed
        const withoutAge = Person.parse({ name: 'Alice' });
        assert.deepStrictEqual(withoutAge, { name: 'Alice' });

        // Parsing with the optional `age` property should also succeed
        const withAge = Person.parse({ name: 'Bob', age: 30 });
        assert.deepStrictEqual(withAge, { name: 'Bob', age: 30 });

        // Parsing with an invalid type for `age` should fail
        // Zod's error message for numbers is "Invalid input: expected number, ..."
        assert.throws(() => Person.parse({ name: 'Eve', age: 'thirty' }), /expected number/i);

        done();
    });
});