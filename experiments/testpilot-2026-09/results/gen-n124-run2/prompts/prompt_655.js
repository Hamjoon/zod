The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.regex', function(done) {
        // Create a schema that only matches the exact string "hello123"
        const schema = zod.z.regex(/^hello123$/);

        // Valid input should succeed
        const valid = schema.safeParse('hello123');
        assert.strictEqual(valid.success, true, 'Expected "hello123" to pass the regex validation');

        // Invalid input should fail
        const invalid = schema.safeParse('hello124');
        assert.strictEqual(invalid.success, false, 'Expected "hello124" to fail the regex validation');

        // Non‑string input should also fail
        const nonString = schema.safeParse(123);
        assert.strictEqual(nonString.success, false, 'Expected non‑string input to fail the regex validation');

        done();
    });
});
``` 
failed with the following error message:
```
schema.safeParse is not a function  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.