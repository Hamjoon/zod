The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.null', function(done) {
        // Create a null schema with custom error messages
        const schema = zod.z.null({
            required_error: "Must be null",
            invalid_type_error: "Not null"
        });

        // Valid case: null should pass without throwing
        assert.doesNotThrow(() => schema.parse(null));

        // Invalid case: a number should fail with the custom invalid_type_error
        try {
            schema.parse(42);
            assert.fail('Expected schema.parse to throw for non‑null value');
        } catch (e) {
            assert.strictEqual(e.errors[0].message, "Not null");
        }

        // Invalid case: undefined should fail with the custom required_error
        try {
            schema.parse(undefined);
            assert.fail('Expected schema.parse to throw for undefined');
        } catch (e) {
            assert.strictEqual(e.errors[0].message, "Must be null");
        }

        done();
    });
});
``` 
failed with the following error message:
```
Cannot read properties of undefined (reading '0')  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.