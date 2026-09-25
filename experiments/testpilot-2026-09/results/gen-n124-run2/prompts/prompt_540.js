The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.lt', function(done) {
        // basic numeric comparisons
        assert.strictEqual(zod.z.lt(3, 5), true, '3 < 5 should be true');
        assert.strictEqual(zod.z.lt(5, 5), false, '5 < 5 should be false');
        assert.strictEqual(zod.z.lt(7, 5), false, '7 < 5 should be false');

        // negative numbers
        assert.strictEqual(zod.z.lt(-10, -5), true, '-10 < -5 should be true');
        assert.strictEqual(zod.z.lt(-5, -10), false, '-5 < -10 should be false');

        // non‑numeric values should return false (or throw – we test false behavior)
        assert.strictEqual(zod.z.lt('a', 5), false, 'non‑numeric value should be false');
        assert.strictEqual(zod.z.lt(3, 'b'), false, 'non‑numeric param should be false');

        done();
    });
});
``` 
failed with the following error message:
```
3 < 5 should be true
+ actual - expected

+ $ZodCheckLessThan {}
- true
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.