The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.minSize', function(done) {
        // Basic usage: a Set of strings must contain at least 2 items
        const schema = zod.z.set(zod.z.string()).minSize(2);

        // Should pass when the Set meets the minimum size
        assert.doesNotThrow(() => {
            schema.parse(new Set(['apple', 'banana']));
        }, 'Schema should accept a Set with 2 or more items');

        // Should fail when the Set is smaller than the minimum
        assert.throws(() => {
            schema.parse(new Set(['only-one']));
        }, (err) => {
            // Zod throws a ZodError; ensure it contains the default minSize message
            return err && err.errors && err.errors[0].message.includes('Set must contain at least 2 items');
        }, 'Schema should reject a Set with fewer than 2 items');

        // Custom error message via the params argument
        const customMsg = 'Custom: not enough elements';
        const schemaWithCustomMsg = zod.z.set(zod.z.string()).minSize(3, { message: customMsg });

        assert.throws(() => {
            schemaWithCustomMsg.parse(new Set(['a', 'b']));
        }, (err) => {
            return err && err.errors && err.errors[0].message === customMsg;
        }, 'Schema should use the custom error message when the minimum is not met');

        done();
    });
});
``` 
failed with the following error message:
```
zod.z.set(...).minSize is not a function  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.