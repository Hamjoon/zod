The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nonoptional', function(done) {
        // Basic usage – should accept a valid value
        const schema = zod.z.nonoptional(zod.string());
        assert.strictEqual(schema.parse('hello'), 'hello');

        // Should reject undefined (default error)
        try {
            schema.parse(undefined);
            assert.fail('Expected validation to fail for undefined');
        } catch (err) {
            assert(err instanceof zod.ZodError, 'Error should be a ZodError');
            const issue = err.errors[0];
            assert(issue.message, 'Error should contain a message');
        }

        // Custom error message via params
        const customSchema = zod.z.nonoptional(zod.string(), { message: 'Value required' });
        try {
            customSchema.parse(undefined);
            assert.fail('Expected validation to fail with custom message');
        } catch (err) {
            assert(err instanceof zod.ZodError, 'Error should be a ZodError');
            const issue = err.errors[0];
            assert.strictEqual(issue.message, 'Value required');
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