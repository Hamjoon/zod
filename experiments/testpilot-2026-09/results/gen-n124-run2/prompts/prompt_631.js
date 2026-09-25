The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.maxLength', function(done) {
        // Create a schema with a maxLength of 5
        const schema = zod.string().maxLength(5);
        // Should succeed for strings of length <= 5
        assert.doesNotThrow(() => schema.parse('hello'));
        assert.doesNotThrow(() => schema.parse(''));
        assert.doesNotThrow(() => schema.parse('12345'));

        // Should fail for strings longer than 5 characters
        try {
            schema.parse('exceeds');
            // If no error is thrown, the test should fail
            assert.fail('Expected a ZodError for a string longer than maxLength');
        } catch (e) {
            // Verify that the error is a ZodError and contains the correct issue code
            assert(e instanceof zod.ZodError, 'Error should be an instance of ZodError');
            const issue = e.issues[0];
            assert.strictEqual(issue.code, 'too_big', 'Issue code should be "too_big"');
            assert.strictEqual(issue.maximum, 5, 'Maximum should be 5');
        }

        // Test custom error message via params
        const customMsg = 'Custom length error';
        const schemaWithMsg = zod.string().maxLength(3, { message: customMsg });
        try {
            schemaWithMsg.parse('abcd');
            assert.fail('Expected a ZodError with custom message');
        } catch (e) {
            assert(e instanceof zod.ZodError);
            const issue = e.issues[0];
            assert.strictEqual(issue.message, customMsg, 'Custom message should be used');
        }

        done();
    });
});
``` 
failed with the following error message:
```
zod.string(...).maxLength is not a function  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.