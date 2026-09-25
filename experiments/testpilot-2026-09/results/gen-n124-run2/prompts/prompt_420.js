The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.transform', function(done) {
        // Create a transform schema that coerces a value to an integer.
        const coercedInt = zod.transform((val, ctx) => {
            try {
                const parsed = Number.parseInt(String(val));
                if (Number.isNaN(parsed)) throw new Error();
                return parsed;
            } catch (e) {
                // Push a custom issue – this mirrors the example in the prompt.
                ctx.issues.push({
                    code: "custom",
                    message: "Not a number",
                    input: val,
                });
                // Returning zod.NEVER aborts the transform while preserving the inferred type.
                return zod.NEVER;
            }
        });

        // ---- Valid input -------------------------------------------------
        const result = coercedInt.parse('123');
        assert.strictEqual(result, 123, 'The transform should return the parsed integer');

        // ---- Invalid input ------------------------------------------------
        try {
            coercedInt.parse('abc');
            // If we get here, the transform didn't throw as expected.
            assert.fail('Expected a ZodError to be thrown for invalid input');
        } catch (err) {
            // Ensure the error is a ZodError and contains our custom issue.
            assert(err instanceof zod.ZodError, 'Error should be an instance of ZodError');
            const issue = err.issues[0];
            assert.strictEqual(issue.code, "custom", 'Issue code should be "custom"');
            assert.strictEqual(issue.message, "Not a number", 'Issue message should match');
            assert.strictEqual(issue.input, 'abc', 'Issue input should be the original value');
        }

        done();
    });
});
``` 
failed with the following error message:
```
Issue input should be the original value

undefined !== 'abc'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.