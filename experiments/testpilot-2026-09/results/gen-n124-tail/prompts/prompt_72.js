The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.safeParse', function(done) {
        // 1️⃣ Successful parse
        const schema = zod.string().min(3);
        const successResult = zod.z.safeParse(schema, 'hello');
        assert.strictEqual(successResult.success, true, 'should succeed for valid string');
        assert.strictEqual(successResult.data, 'hello', 'parsed data should match input');

        // 2️⃣ Failing parse
        const failResult = zod.z.safeParse(schema, 'hi');
        assert.strictEqual(failResult.success, false, 'should fail for short string');
        assert.ok(failResult.error instanceof zod.ZodError, 'error should be a ZodError');

        // 3️⃣ Async schema should throw $ZodAsyncError
        const asyncSchema = zod.string().refine(
            async (val) => val.length > 0,
            { message: 'must not be empty', async: true }
        );
        assert.throws(
            () => {
                // This call must be synchronous; the internal implementation will throw
                zod.z.safeParse(asyncSchema, 'test');
            },
            (err) => err && err.name === '$ZodAsyncError',
            'async schemas should throw $ZodAsyncError when using safeParse'
        );

        done();
    });
});
``` 
failed with the following error message:
```
async schemas should throw $ZodAsyncError when using safeParse  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.