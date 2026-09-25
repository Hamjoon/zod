The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nonnegative', function(done) {
        // Create a schema that enforces non‑negative numbers
        const schema = zod.z.number().nonnegative();

        // Values that should pass
        assert.doesNotThrow(() => schema.parse(0), '0 should be accepted as non‑negative');
        assert.doesNotThrow(() => schema.parse(42), 'Positive numbers should be accepted');

        // Values that should fail
        assert.throws(
            () => schema.parse(-1),
            /nonnegative/,
            'Negative numbers should be rejected'
        );

        done();
    });
});
``` 
failed with the following error message:
```
Negative numbers should be rejected  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.