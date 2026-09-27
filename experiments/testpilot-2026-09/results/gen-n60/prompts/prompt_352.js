The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.parse', function() {
        // 1️⃣ Successful parse should return the original value
        const schemaSuccess = zod.string();
        const successResult = zod.z.parse(schemaSuccess, 'hello');
        assert.strictEqual(successResult, 'hello');

        // 2️⃣ Validation error should throw a ZodError
        const schemaError = zod.string().min(5);
        assert.throws(() => {
            zod.z.parse(schemaError, 'hi');
        }, err => err instanceof zod.ZodError);

        // 3️⃣ Async schema should throw a ZodAsyncError when used with the sync parse
        const schemaAsync = zod.string().refine(
            async (val) => true,
            { message: 'always true' }
        );
        assert.throws(() => {
            zod.z.parse(schemaAsync, 'test');
        }, err => err && typeof err.name === 'string' && err.name.includes('ZodAsyncError'));
    });
});
``` 
failed with the following error message:
```
The validation function is expected to return "true". Received false

Caught error:

Error: Encountered Promise during synchronous parse. Use .parseAsync() instead.  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.