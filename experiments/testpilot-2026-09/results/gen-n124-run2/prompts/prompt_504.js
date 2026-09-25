The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.check', function(done) {
        // a simple function to validate
        function sample() { return 42; }

        // zod.z.check should accept functions without throwing
        assert.doesNotThrow(() => {
            zod.z.check(sample);
        }, 'zod.z.check threw an error for a valid function');

        // and it should reject non‑function values (e.g., a number)
        assert.throws(() => {
            zod.z.check(123);
        }, /TypeError|Invalid/, 'zod.z.check did not throw for a non‑function');

        done();
    });
});
``` 
failed with the following error message:
```
Missing expected exception: zod.z.check did not throw for a non‑function  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.