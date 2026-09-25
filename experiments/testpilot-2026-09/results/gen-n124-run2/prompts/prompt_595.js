The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nonnegative', function(done) {
        // Create a number schema that only accepts non‑negative values
        const schema = zod.z.number().nonnegative();

        // Values that should pass validation
        assert.doesNotThrow(() => schema.parse(0), '0 should be accepted as non‑negative');
        assert.doesNotThrow(() => schema.parse(42), 'positive numbers should be accepted');

        // Values that should fail validation
        assert.throws(() => schema.parse(-1), /nonnegative/, '-1 should be rejected');

        // Optional: test custom error message via params
        const customSchema = zod.z.number().nonnegative({ message: 'must be ≥ 0' });
        try {
            customSchema.parse(-5);
        } catch (e) {
            assert.ok(e.errors.some(err => err.message === 'must be ≥ 0'), 'custom error message should be used');
        }

        done();
    });
});
``` 
failed with the following error message:
```
-1 should be rejected  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.