The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.lt', function(done) {
        // basic usage – no extra params
        const checkSimple = zod.z.lt(10);
        // the returned object should contain the expected properties
        assert.strictEqual(checkSimple.check, "less_than", "check type should be 'less_than'");
        assert.strictEqual(checkSimple.inclusive, false, "inclusive should be false");
        assert.strictEqual(checkSimple.value, 10, "value should be the one passed in");

        // usage with additional params (e.g., a custom message)
        const customMessage = "must be less than 20";
        const checkWithParams = zod.z.lt(20, { message: customMessage });
        assert.strictEqual(checkWithParams.check, "less_than", "check type should still be 'less_than'");
        assert.strictEqual(checkWithParams.inclusive, false, "inclusive should remain false");
        assert.strictEqual(checkWithParams.value, 20, "value should be the one passed in");
        // the extra param should be merged into the result
        assert.strictEqual(checkWithParams.message, customMessage, "custom message should be preserved");

        done();
    });
});
``` 
failed with the following error message:
```
check type should be 'less_than'
+ actual - expected

+ undefined
- 'less_than'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.