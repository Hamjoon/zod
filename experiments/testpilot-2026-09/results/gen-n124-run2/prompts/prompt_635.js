The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.minLength', function() {
        // Test with explicit params
        const result = zod.z.minLength(5, { message: 'Too short' });
        assert.strictEqual(result.check, 'min_length', 'check property should be "min_length"');
        assert.strictEqual(result.minimum, 5, 'minimum should be the value passed');
        assert.strictEqual(result.message, 'Too short', 'params should be merged into the result');

        // Test with only the minimum argument (no params)
        const resultNoParams = zod.z.minLength(3);
        assert.strictEqual(resultNoParams.check, 'min_length', 'check property should be "min_length"');
        assert.strictEqual(resultNoParams.minimum, 3, 'minimum should be the value passed');
        // When no params are supplied, optional fields like message should be undefined
        assert.strictEqual(resultNoParams.message, undefined, 'message should be undefined when not provided');
    });
});
``` 
failed with the following error message:
```
check property should be "min_length"
+ actual - expected

+ undefined
- 'min_length'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.