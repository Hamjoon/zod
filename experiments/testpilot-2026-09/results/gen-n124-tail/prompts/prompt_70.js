The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.safeParse', function(done) {
        // ---- Successful parse ----
        const successResult = zod.z.safeParse(zod.z.string(), 'hello');
        assert.strictEqual(successResult.success, true, 'should be successful');
        assert.strictEqual(successResult.data, 'hello', 'parsed data should match input');

        // ---- Failing parse ----
        const failResult = zod.z.safeParse(zod.z.string(), 123);
        assert.strictEqual(failResult.success, false, 'should fail for wrong type');
        assert.ok(failResult.error, 'error object should be present');
        // The error should contain at least one issue describing the type mismatch
        assert.ok(
            failResult.error.issues && failResult.error.issues.length > 0,
            'error should contain issues'
        );
        // The first issue message should mention "string"
        assert.ok(
            /string/.test(failResult.error.issues[0].message),
            'issue message should mention expected string'
        );

        // ---- Async schema should throw $ZodAsyncError ----
        const asyncSchema = zod.z.promise(zod.z.string());
        assert.throws(
            () => {
                // Passing a resolved promise as the value; safeParse should detect async schema
                zod.z.safeParse(asyncSchema, Promise.resolve('hi'));
            },
            (err) => {
                // The thrown error should be an instance of Zod's internal async error class
                // We cannot import the internal class directly, but we can check its name
                return err && err.name && err.name.includes('ZodAsyncError');
            },
            'should throw a ZodAsyncError for async schemas'
        );

        done();
    });
});
``` 
failed with the following error message:
```
should throw a ZodAsyncError for async schemas  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.