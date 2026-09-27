The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.includes', function(done) {
        // Basic includes check – should pass
        const schema = zod.string().includes('tuna');
        assert.strictEqual(schema.parse('I love tuna sandwiches'), 'I love tuna sandwiches');

        // Basic includes check – should fail
        try {
            schema.parse('I love salmon');
            assert.fail('Expected a ZodError to be thrown for missing substring');
        } catch (e) {
            // Ensure a ZodError was thrown
            assert(e instanceof zod.ZodError, 'Error should be an instance of ZodError');
            // Default error message is "Invalid input"
            assert.strictEqual(e.errors[0].message, 'Invalid input');
        }

        // Includes with a custom message – should fail with that message
        const schemaWithMsg = zod.string().includes('tuna', { message: 'Must include tuna' });
        try {
            schemaWithMsg.parse('no fish here');
            assert.fail('Expected a ZodError to be thrown for missing substring with custom message');
        } catch (e) {
            assert(e instanceof zod.ZodError, 'Error should be an instance of ZodError');
            assert.strictEqual(e.errors[0].message, 'Must include tuna');
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