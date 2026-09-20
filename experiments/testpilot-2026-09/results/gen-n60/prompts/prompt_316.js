The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nonpositive', function(done) {
        // Number schema: should accept values <= 0 and reject > 0
        const numSchema = zod.z.number().nonpositive();

        // Valid cases
        assert.doesNotThrow(() => numSchema.parse(0), '0 should be accepted as non‑positive');
        assert.doesNotThrow(() => numSchema.parse(-42), '-42 should be accepted as non‑positive');

        // Invalid case
        assert.throws(
            () => numSchema.parse(3.14),
            /Number must be less than or equal to 0/,
            'Positive numbers should be rejected'
        );

        // BigInt schema: should accept values <= 0n and reject > 0n
        const bigIntSchema = zod.z.bigint().nonpositive();

        // Valid cases
        assert.doesNotThrow(() => bigIntSchema.parse(0n), '0n should be accepted as non‑positive');
        assert.doesNotThrow(() => bigIntSchema.parse(-100n), '-100n should be accepted as non‑positive');

        // Invalid case
        assert.throws(
            () => bigIntSchema.parse(7n),
            /BigInt must be less than or equal to 0/,
            'Positive BigInts should be rejected'
        );

        done();
    });
});
``` 
failed with the following error message:
```
Positive numbers should be rejected  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.