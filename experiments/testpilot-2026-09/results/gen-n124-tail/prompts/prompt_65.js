The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.parseAsync', function(done) {
        // Create a schema that asynchronously validates string length <= 8
        const schema = zod.string().refine(
            async (val) => val.length <= 8,
            { message: "Too long" }
        );

        // First, a successful parse
        zod.z.parseAsync(schema, "hello")
            .then((result) => {
                assert.strictEqual(result, "hello", "Result should be the original string");
                // Then, attempt to parse an invalid value
                return zod.z.parseAsync(schema, "this is too long");
            })
            .then(() => {
                // If we reach here, the invalid parse did not throw as expected
                done(new Error("Expected parseAsync to throw a ZodError for an invalid value"));
            })
            .catch((err) => {
                // The error should be a ZodError with the correct message
                assert(err instanceof zod.ZodError, "Error should be an instance of ZodError");
                assert.strictEqual(err.errors[0].message, "Too long", "Error message should match the refinement message");
                done();
            })
            .catch(done); // catch any unexpected errors
    });
});
``` 
failed with the following error message:
```
Cannot read properties of undefined (reading '0')  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.