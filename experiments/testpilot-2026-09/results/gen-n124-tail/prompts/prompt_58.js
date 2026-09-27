The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.parse', function(done) {
        // ----- valid value -----
        const stringSchema = zod.string();
        const validValue = "hello world";
        const parsed = zod.z.parse(stringSchema, validValue);
        assert.strictEqual(parsed, validValue, 'Should return the original value for a valid schema');

        // ----- invalid value -----
        try {
            zod.z.parse(stringSchema, 123);
            // If we get here, the error was not thrown as expected
            assert.fail('Expected ZodError to be thrown for invalid value');
        } catch (e) {
            // Zod should throw its own error type
            assert(e instanceof zod.ZodError, 'Expected a ZodError instance');
        }

        // ----- async schema should throw $ZodAsyncError -----
        // Create a schema that performs an async refinement
        const asyncSchema = zod.string().refine(async (val) => true);
        try {
            zod.z.parse(asyncSchema, "async test");
            assert.fail('Expected $ZodAsyncError to be thrown for async schema');
        } catch (e) {
            // The internal async error has the name "$ZodAsyncError"
            // It may not be exported, so we check the name property
            assert.strictEqual(e.name, '$ZodAsyncError', 'Expected $ZodAsyncError for async schema');
        }

        done();
    });
});
``` 
failed with the following error message:
```
Expected $ZodAsyncError for async schema
+ actual - expected

+ 'Error'
- '$ZodAsyncError'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.