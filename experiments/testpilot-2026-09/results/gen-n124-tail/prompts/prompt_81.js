The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.setErrorMap', function(done) {
        // Define a custom error map that always returns the same message
        const customMap = () => ({ message: 'my custom error' });

        // Apply the custom error map globally
        zod.z.setErrorMap(customMap);

        // Create a simple schema that will definitely fail
        const schema = zod.string().min(5);

        try {
            // This should throw a ZodError because the string is too short
            schema.parse('a');
            // If no error is thrown, the test should fail
            assert.fail('Expected schema.parse to throw an error');
        } catch (e) {
            // Ensure we caught a ZodError
            assert(e instanceof zod.ZodError, 'Caught error should be a ZodError');

            // The custom error map should have overridden the default message
            const firstError = e.errors[0];
            assert.strictEqual(firstError.message, 'my custom error', 'Error message should come from custom map');
        }

        // Clean up: reset to the default error map to avoid side‑effects for other tests
        zod.z.setErrorMap(zod.z.getDefaultErrorMap ? zod.z.getDefaultErrorMap() : () => ({}));

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