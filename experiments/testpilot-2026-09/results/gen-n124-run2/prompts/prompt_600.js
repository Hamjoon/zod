The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.multipleOf', function(done) {
        // value is a multiple of divisor
        assert.strictEqual(zod.z.multipleOf(10, 5), true);
        // value is not a multiple of divisor
        assert.strictEqual(zod.z.multipleOf(7, 5), false);
        // negative values should also work
        assert.strictEqual(zod.z.multipleOf(-15, 5), true);
        // zero is a multiple of any non‑zero divisor
        assert.strictEqual(zod.z.multipleOf(0, 3), true);
        // divisor of zero should throw an error (invalid operation)
        assert.throws(() => zod.z.multipleOf(10, 0), /division by zero|invalid divisor/);
        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly equal:
+ actual - expected

+ $ZodCheckMultipleOf {}
- true
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.