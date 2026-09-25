The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nullable', function(done) {
        // Create a nullable string schema
        const nullableString = zod.string().nullable();

        // 1. Parsing a valid string should succeed and return the string
        const parsedString = nullableString.parse('hello');
        assert.strictEqual(parsedString, 'hello', 'Should return the original string');

        // 2. Parsing null should succeed and return null
        const parsedNull = nullableString.parse(null);
        assert.strictEqual(parsedNull, null, 'Should return null for nullable input');

        // 3. Parsing an invalid type (e.g., number) should throw a ZodError
        let threw = false;
        try {
            nullableString.parse(123);
        } catch (e) {
            threw = true;
            assert(e instanceof zod.ZodError, 'Error should be a ZodError');
            // The error should contain one issue about expected string or null
            const issue = e.issues[0];
            assert(issue.message.includes('Expected string'), 'Issue message should mention string');
        }
        assert(threw, 'Parsing a number should throw');

        // 4. safeParse should return success for both string and null, failure otherwise
        const safeString = nullableString.safeParse('world');
        assert.strictEqual(safeString.success, true, 'safeParse should succeed for a string');
        assert.strictEqual(safeString.data, 'world');

        const safeNull = nullableString.safeParse(null);
        assert.strictEqual(safeNull.success, true, 'safeParse should succeed for null');
        assert.strictEqual(safeNull.data, null);

        const safeInvalid = nullableString.safeParse(true);
        assert.strictEqual(safeInvalid.success, false, 'safeParse should fail for non‑string/non‑null');
        assert(Array.isArray(safeInvalid.error.issues), 'Error should contain issues array');

        // 5. Ensure nullable works with complex types (object)
        const userSchema = zod.object({ name: zod.string() }).nullable();
        const parsedUser = userSchema.parse({ name: 'Alice' });
        assert.deepStrictEqual(parsedUser, { name: 'Alice' });
        assert.strictEqual(userSchema.parse(null), null);

        // All assertions passed
        done();
    });
});
``` 
failed with the following error message:
```
Issue message should mention string  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.