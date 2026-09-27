The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.maxLength', function(done) {
        const max = 15;
        const params = { message: 'Value exceeds maximum length' };
        const result = zod.z.maxLength(max, params);

        // The returned object should contain the expected properties
        assert.strictEqual(result.check, 'max_length', 'check type should be "max_length"');
        assert.strictEqual(result.maximum, max, 'maximum should match the supplied value');
        // Params should be merged (after normalization) into the result
        assert.strictEqual(result.message, params.message, 'message param should be preserved');

        done();
    });
});
``` 
failed with the following error message:
```
check type should be "max_length"
+ actual - expected

+ undefined
- 'max_length'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.