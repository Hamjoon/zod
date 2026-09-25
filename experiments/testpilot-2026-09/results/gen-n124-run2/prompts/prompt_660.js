The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.lowercase', function(done) {
        // basic check – default properties
        const check = zod.z.lowercase();
        assert.strictEqual(typeof check, 'object', 'lowercase should return an object');
        assert.strictEqual(check.check, 'string_format', 'check type should be string_format');
        assert.strictEqual(check.format, 'lowercase', 'format should be lowercase');

        // custom params should be merged into the returned object
        const customCheck = zod.z.lowercase({ message: 'must be lowercase' });
        assert.strictEqual(customCheck.message, 'must be lowercase', 'custom param "message" should be present');

        done();
    });
});
``` 
failed with the following error message:
```
check type should be string_format
+ actual - expected

+ undefined
- 'string_format'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.