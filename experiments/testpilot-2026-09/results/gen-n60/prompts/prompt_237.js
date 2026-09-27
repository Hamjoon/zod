The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.gte', function(done) {
        // Arrange: define a value and some custom params
        const testValue = 42;
        const customParams = { customKey: 'customValue' };

        // Act: call the gte function
        const result = zod.z.gte(testValue, customParams);

        // Assert: the result should be a check object with the expected shape
        assert.strictEqual(result.check, "greater_than", "check type should be 'greater_than'");
        assert.strictEqual(result.inclusive, true, "inclusive flag should be true");
        assert.strictEqual(result.value, testValue, "value should be the one passed in");
        // The custom params should be merged into the result (normalizeParams is a pass‑through for unknown keys)
        assert.strictEqual(result.customKey, customParams.customKey, "custom params should be preserved");

        done();
    });
});
``` 
failed with the following error message:
```
check type should be 'greater_than'
+ actual - expected

+ undefined
- 'greater_than'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.