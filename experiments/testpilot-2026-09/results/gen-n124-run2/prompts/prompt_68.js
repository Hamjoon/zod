The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.string', function(done) {
        // Create a string schema with custom error messages
        const schema = zod.z.string({
            required_error: "Required",
            invalid_type_error: "Invalid"
        });

        // Verify that the returned object is a ZodString instance
        assert(schema instanceof zod.ZodString, "Returned schema should be an instance of ZodString");

        // Test that the custom required_error is used
        try {
            schema.parse(undefined);
            // If no error is thrown, the test should fail
            assert.fail("Parsing undefined should have thrown a validation error");
        } catch (e) {
            assert.strictEqual(e.errors[0].message, "Required", "Custom required_error message should be used");
        }

        // Test that the custom invalid_type_error is used
        try {
            schema.parse(123);
            assert.fail("Parsing a number should have thrown a validation error");
        } catch (e) {
            assert.strictEqual(e.errors[0].message, "Invalid", "Custom invalid_type_error message should be used");
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