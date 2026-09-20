The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.maxSize', function(done) {
        // Basic usage without extra params
        const result = zod.z.maxSize(5);
        assert.strictEqual(result.check, 'max_size', 'check property should be "max_size"');
        assert.strictEqual(result.maximum, 5, 'maximum should be the value passed');

        // Usage with additional params (e.g., a custom message)
        const customMessage = 'Too large';
        const resultWithParams = zod.z.maxSize(10, { message: customMessage });
        assert.strictEqual(resultWithParams.check, 'max_size', 'check property should still be "max_size"');
        assert.strictEqual(resultWithParams.maximum, 10, 'maximum should reflect the passed value');
        assert.strictEqual(resultWithParams.message, customMessage, 'custom params should be merged into the result');

        done();
    });
});
``` 
failed with the following error message:
```
check property should be "max_size"
+ actual - expected

+ undefined
- 'max_size'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.