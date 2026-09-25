The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.gte', function(done) {
        // basic numeric schema with .gte
        const schema = zod.z.number().gte(5);
        // values that satisfy the constraint should not throw
        assert.doesNotThrow(() => schema.parse(5));
        assert.doesNotThrow(() => schema.parse(10));

        // values that violate the constraint should throw a ZodError
        assert.throws(() => schema.parse(4), err => {
            // ensure it's a ZodError and contains the expected default message
            return err && err.errors && err.errors[0].message.includes('Number must be greater than or equal to 5');
        });

        // test custom error message via params argument
        const customSchema = zod.z.number().gte(5, { message: 'Value must be ≥ 5' });
        try {
            customSchema.parse(2);
            // If no error is thrown, fail the test
            assert.fail('Expected a ZodError to be thrown');
        } catch (e) {
            // Verify that the custom message is present
            assert(e.errors && e.errors[0].message === 'Value must be ≥ 5');
        }

        done();
    });
});
``` 
failed with the following error message:
```
The validation function is expected to return "true". Received undefined

Caught error:

[
  {
    "origin": "number",
    "code": "too_small",
    "minimum": 5,
    "inclusive": true,
    "path": [],
    "message": "Too small: expected number to be >=5"
  }
]  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.