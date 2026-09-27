The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.size', function(done) {
        // basic usage – only size argument
        const check1 = zod.z.size(3);
        assert.strictEqual(check1.check, 'size_equals', 'check type should be size_equals');
        assert.strictEqual(check1.size, 3, 'size should be the value passed');

        // usage with additional params – ensure they are preserved
        const check2 = zod.z.size(5, { message: 'must be exactly 5' });
        assert.strictEqual(check2.check, 'size_equals', 'check type should still be size_equals');
        assert.strictEqual(check2.size, 5, 'size should be the value passed');
        // the params object is normalized, but the message should survive
        assert.strictEqual(check2.message, 'must be exactly 5', 'custom message should be retained');

        done();
    });
});
``` 
failed with the following error message:
```
check type should be size_equals
+ actual - expected

+ undefined
- 'size_equals'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.