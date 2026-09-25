The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nanoid', function(done) {
        // Default nanoid schema (default size is 21)
        const defaultSchema = zod.z.nanoid();
        // A valid nanoid of length 21 – only URL‑safe characters are allowed
        const validDefault = 'abcdefghijklmnopqrstu'; // 21 chars
        assert.strictEqual(defaultSchema.parse(validDefault), validDefault, 'should accept a valid nanoid of default length');

        // Should reject a nanoid with the wrong length
        assert.throws(() => {
            defaultSchema.parse('short');
        }, /.+/, 'should reject nanoids that are not the expected length');

        // Custom size nanoid schema
        const customSize = 10;
        const customSchema = zod.z.nanoid({ size: customSize });
        const validCustom = 'abcdefghij'; // 10 chars
        assert.strictEqual(customSchema.parse(validCustom), validCustom, 'should accept a valid nanoid of custom size');

        // Reject a nanoid that does not match the custom size
        assert.throws(() => {
            customSchema.parse(validDefault);
        }, /.+/, 'should reject nanoids that do not match the custom size');

        done();
    });
});
``` 
failed with the following error message:
```
[
  {
    "origin": "string",
    "code": "invalid_format",
    "format": "nanoid",
    "pattern": "/^[a-zA-Z0-9_-]{21}$/",
    "path": [],
    "message": "Invalid nanoid"
  }
]  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.