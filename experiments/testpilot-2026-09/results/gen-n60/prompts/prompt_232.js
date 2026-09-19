The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.negative', function(done) {
        // Create a schema that only accepts negative numbers
        const schema = zod.z.negative();

        // Should accept a negative number without throwing
        assert.doesNotThrow(() => {
            const result = schema.parse(-42);
            assert.strictEqual(result, -42);
        });

        // Zero is not negative – should throw a validation error
        assert.throws(() => {
            schema.parse(0);
        });

        // Positive numbers are not allowed – should throw a validation error
        assert.throws(() => {
            schema.parse(7);
        });

        // Non‑numeric values should also cause a validation error
        assert.throws(() => {
            schema.parse('not a number');
        });

        done();
    });
});
``` 
failed with the following error message:
```
Got unwanted exception.
Actual message: "schema.parse is not a function"  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.