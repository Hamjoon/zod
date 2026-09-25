The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uint64', function(done) {
        // Create the uint64 schema (no special params needed for basic usage)
        const uint64Schema = zod.z.uint64();

        // ---- Valid cases ----
        // Zero is a valid unsigned 64‑bit integer
        let result = uint64Schema.safeParse(0);
        assert.strictEqual(result.success, true);
        assert.strictEqual(result.data, 0);

        // A typical positive integer within range
        result = uint64Schema.safeParse(123456);
        assert.strictEqual(result.success, true);
        assert.strictEqual(result.data, 123456);

        // The maximum value that fits into an unsigned 64‑bit integer
        const maxU64 = BigInt('18446744073709551615');
        result = uint64Schema.safeParse(maxU64);
        assert.strictEqual(result.success, true);
        assert.strictEqual(result.data, maxU64);

        // ---- Invalid cases ----
        // Negative numbers are not allowed
        result = uint64Schema.safeParse(-1);
        assert.strictEqual(result.success, false);

        // Values exceeding the uint64 limit should be rejected
        const overflow = BigInt('18446744073709551616'); // max + 1
        result = uint64Schema.safeParse(overflow);
        assert.strictEqual(result.success, false);

        // Non‑numeric types should also be rejected
        result = uint64Schema.safeParse("12345");
        assert.strictEqual(result.success, false);

        result = uint64Schema.safeParse(null);
        assert.strictEqual(result.success, false);

        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly equal:

false !== true
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.