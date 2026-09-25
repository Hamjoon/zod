The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.endsWith', function(done) {
        // Schema with default error message
        const schema = zod.string().endsWith('.com');

        // Should pass when the string ends with the suffix
        assert.doesNotThrow(() => schema.parse('example.com'));

        // Should fail when the string does not end with the suffix
        assert.throws(() => schema.parse('example.org'), zod.ZodError);

        // Schema with a custom error message
        const customSchema = zod.string().endsWith('.com', { message: 'Only .com domains allowed' });

        // Should fail and return the custom message
        assert.throws(
            () => customSchema.parse('example.org'),
            err => err instanceof zod.ZodError && err.errors[0].message === 'Only .com domains allowed'
        );

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