The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.transform', function(done) {
        // Create a transform schema that coerces a value to an integer.
        const coercedInt = zod.transform((val, ctx) => {
            const parsed = Number.parseInt(String(val));
            if (Number.isNaN(parsed)) {
                ctx.issues.push({
                    code: "custom",
                    message: "Not a number",
                    input: val,
                });
                // Returning z.NEVER aborts the transform without affecting the inferred type.
                return zod.NEVER;
            }
            return parsed;
        });

        // ---- Valid input ----
        const validResult = coercedInt.parse("123");
        assert.strictEqual(validResult, 123, "The transform should return the parsed integer");

        // ---- Invalid input ----
        try {
            coercedInt.parse("abc");
            // If we get here, the transform didn't throw as expected.
            assert.fail("Expected parse to throw a ZodError for non‑numeric input");
        } catch (e) {
            // The error should be a ZodError with our custom issue.
            assert(e instanceof zod.ZodError, "Error should be a ZodError");
            const issue = e.issues[0];
            assert.strictEqual(issue.message, "Not a number", "Custom error message should match");
            assert.strictEqual(issue.input, "abc", "The input reported in the issue should be the original value");
        }

        done();
    });
});
``` 
failed with the following error message:
```
The input reported in the issue should be the original value

undefined !== 'abc'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.