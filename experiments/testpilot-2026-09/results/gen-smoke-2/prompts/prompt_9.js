The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.check', function(done) {
        // Verify that the check method exists and is a function
        assert.strictEqual(typeof zod.z.check, 'function');

        // A simple function to be checked
        function fn(x) { return x; }

        // Call zod.z.check with a valid function
        const checkedFn = zod.z.check(fn);

        // The returned value should also be a function
        assert.strictEqual(typeof checkedFn, 'function');

        // The returned function should behave like the original
        assert.strictEqual(checkedFn(42), 42);

        // Passing a non‑function should throw an error
        assert.throws(() => {
            zod.z.check(123);
        }, /function/);

        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly equal:
+ actual - expected

+ 'object'
- 'function'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.