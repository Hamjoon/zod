The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.regex', function(done) {
        // Arrange: define a regex pattern and some custom params
        const pattern = /^[a-z]+$/;
        const params = { message: 'must be lowercase letters only' };

        // Act: create the regex check using the zod API
        const check = zod.z.regex(pattern, params);

        // Assert: the returned object should be a $ZodCheckRegex with the correct properties
        // 1. It should have the base check type and format
        assert.strictEqual(check.check, 'string_format');
        assert.strictEqual(check.format, 'regex');

        // 2. The pattern we passed in should be stored unchanged
        assert.strictEqual(check.pattern, pattern);

        // 3. Any additional params should be merged onto the check object (e.g., message)
        assert.strictEqual(check.message, params.message);

        // 4. The object should be an instance of the internal $ZodCheckRegex class
        //    (accessed via the zod.checks namespace)
        const ZodCheckRegex = zod.checks && zod.checks.$ZodCheckRegex;
        if (ZodCheckRegex) {
            assert.ok(check instanceof ZodCheckRegex, 'check is instance of $ZodCheckRegex');
        }

        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly equal:
+ actual - expected

+ undefined
- 'string_format'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.