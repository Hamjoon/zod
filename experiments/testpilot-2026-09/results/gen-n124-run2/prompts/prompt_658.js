The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.lowercase', function(done) {
        // Test with custom parameters
        const customParams = { message: 'must be lowercase' };
        const resultWithParams = zod.z.lowercase(customParams);
        // Core properties should always be set
        assert.strictEqual(resultWithParams.check, 'string_format');
        assert.strictEqual(resultWithParams.format, 'lowercase');
        // Custom parameters should be merged into the result (normalizeParams propagates them)
        assert.strictEqual(resultWithParams.message, customParams.message);

        // Test with no parameters – should still have the core properties
        const resultNoParams = zod.z.lowercase();
        assert.strictEqual(resultNoParams.check, 'string_format');
        assert.strictEqual(resultNoParams.format, 'lowercase');
        // When no custom params are supplied, extra fields should be undefined or not present
        assert.strictEqual(resultNoParams.message, undefined);

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