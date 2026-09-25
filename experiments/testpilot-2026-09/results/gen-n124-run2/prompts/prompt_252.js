The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uint64', function(done) {
        // Valid uint64 values should not throw
        assert.doesNotThrow(() => {
            // Using a bigint within the uint64 range
            const result = zod.z.uint64(0n);
            // The function may return the value or a schema; just ensure it's defined
            assert.ok(result !== undefined);
        });
        assert.doesNotThrow(() => {
            const result = zod.z.uint64(18446744073709551615n); // max uint64
            assert.ok(result !== undefined);
        });

        // Values outside the uint64 range should throw
        assert.throws(() => {
            zod.z.uint64(-1n); // negative not allowed
        });
        assert.throws(() => {
            // Exceeds max uint64
            zod.z.uint64(18446744073709551616n);
        });

        // Non‑bigint types should also throw
        assert.throws(() => {
            zod.z.uint64(123); // plain number
        });
        assert.throws(() => {
            zod.z.uint64("123"); // string
        });

        done();
    });
});
``` 
failed with the following error message:
```
Missing expected exception.  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.