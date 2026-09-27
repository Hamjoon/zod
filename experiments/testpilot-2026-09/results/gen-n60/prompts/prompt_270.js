The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.maxSize', function(done) {
        // Create a maxSize check with a custom message
        const maxSizeCheck = z.maxSize(5, { message: 'Too many items' });

        // The check should be an instance of the internal $ZodCheckMaxSize class
        // and expose the expected properties.
        assert.strictEqual(maxSizeCheck.check, 'max_size', 'check type should be "max_size"');
        assert.strictEqual(maxSizeCheck.maximum, 5, 'maximum should be the value passed to maxSize');
        assert.strictEqual(maxSizeCheck.message, 'Too many items', 'custom param should be preserved');

        // Additionally, verify that the check works when attached to a schema.
        // Here we use a simple string schema and ensure strings of length <=5 pass,
        // while longer strings fail.
        const schema = z.set(z.string()).check(z.maxSize(5));

        // Valid case (length 5)
        const resultOk = schema.validate('abcde');
        assert.strictEqual(resultOk.success, true, 'String of length 5 should pass maxSize(5)');

        // Invalid case (length 6)
        const resultFail = schema.validate('abcdef');
        assert.strictEqual(resultFail.success, false, 'String of length 6 should fail maxSize(5)');
        assert.ok(
            /max_size/.test(resultFail.error),
            'Error message should indicate a max_size violation'
        );

        done();
    });
});
``` 
failed with the following error message:
```
z is not defined  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.