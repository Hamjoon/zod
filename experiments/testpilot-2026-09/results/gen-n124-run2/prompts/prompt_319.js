The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.object', function(done) {
        const { object, string, number } = zod.z;

        // Basic object schema
        const schema = object({
            name: string(),
            age: number().int()
        });

        // Valid input should parse and strip unknown keys
        const validInput = { name: "Alice", age: 30, extra: "ignored" };
        const parsed = schema.parse(validInput);
        assert.deepStrictEqual(parsed, { name: "Alice", age: 30 });

        // Missing required field should produce a ZodError with the correct path
        try {
            schema.parse({ name: "Bob" });
            assert.fail("Parsing should have thrown due to missing 'age'");
        } catch (e) {
            assert(e instanceof zod.ZodError, "Error should be a ZodError");
            const hasAgeIssue = e.errors.some(issue => issue.path[0] === "age");
            assert(hasAgeIssue, "Error should contain an issue for the missing 'age' field");
        }

        // Using the `params` argument to set a custom required_error message
        const requiredSchema = object(
            { foo: string() },
            { required_error: "Object required" }
        );

        try {
            requiredSchema.parse(undefined);
            assert.fail("Parsing undefined should have thrown due to required_error");
        } catch (e) {
            assert(e instanceof zod.ZodError, "Error should be a ZodError");
            const hasCustomMessage = e.errors.some(issue => issue.message === "Object required");
            assert(hasCustomMessage, "Error should contain the custom required_error message");
        }

        done();
    });
});
``` 
failed with the following error message:
```
Cannot read properties of undefined (reading 'some')  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.