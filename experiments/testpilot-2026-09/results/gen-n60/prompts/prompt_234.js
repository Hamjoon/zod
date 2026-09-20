The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.negative', function(done) {
        // Create a schema that only accepts negative numbers
        const schema = zod.z.number().negative();

        // Positive case: a negative number should pass validation
        assert.doesNotThrow(() => {
            schema.parse(-42);
        }, 'Negative number should be accepted');

        // Edge case: zero is not negative and should fail
        assert.throws(() => {
            schema.parse(0);
        }, /Number must be less than 0/, 'Zero should be rejected');

        // Positive case: a positive number should also fail
        assert.throws(() => {
            schema.parse(7);
        }, /Number must be less than 0/, 'Positive number should be rejected');

        done();
    });
});
``` 
failed with the following error message:
```
Zero should be rejected  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.