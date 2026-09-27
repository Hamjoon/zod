The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.negative', function(done) {
        // negative values should be true
        assert.strictEqual(zod.z.negative(-10), true);
        assert.strictEqual(zod.z.negative(-0.0001), true);
        // zero is not negative
        assert.strictEqual(zod.z.negative(0), false);
        // positive values should be false
        assert.strictEqual(zod.z.negative(0.0001), false);
        assert.strictEqual(zod.z.negative(42), false);
        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly equal:
+ actual - expected

+ $ZodCheckLessThan {}
- true
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.