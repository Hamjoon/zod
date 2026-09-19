The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.uuidv6', function(done) {
        // A known valid UUID v6 (version bits = 6, variant bits = 10)
        const validV6 = '00000000-0000-6000-8000-000000000000';
        // An invalid UUID (wrong version, here version 4)
        const invalidV6 = '00000000-0000-4000-8000-000000000000';

        // Create the schema
        const schema = zod.z.uuidv6();

        // Should accept a valid v6 UUID
        const parsed = schema.parse(validV6);
        assert.strictEqual(parsed, validV6, 'Valid UUID v6 should be parsed unchanged');

        // Should reject an invalid UUID (wrong version)
        assert.throws(() => {
            schema.parse(invalidV6);
        }, /Invalid uuid/, 'Invalid UUID version should throw');

        done();
    });
});
``` 
failed with the following error message:
```
Invalid UUID version should throw  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.