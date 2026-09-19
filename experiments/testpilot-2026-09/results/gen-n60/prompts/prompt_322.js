The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.iso.duration', function(done) {
        // Create a schema that validates ISO 8601 duration strings
        const schema = zod.z.iso.duration();

        // A known‑good ISO 8601 duration
        const validDuration = 'P1Y2M3DT4H5M6S';
        // Ensure parsing a valid duration does not throw and returns the same string
        assert.doesNotThrow(() => {
            const parsed = schema.parse(validDuration);
            assert.strictEqual(parsed, validDuration);
        }, 'Valid ISO duration should be accepted');

        // An invalid duration string
        const invalidDuration = 'not-a-duration';
        // Ensure parsing an invalid duration throws a ZodError
        assert.throws(() => {
            schema.parse(invalidDuration);
        }, /ZodError/, 'Invalid duration should be rejected');

        done();
    });
});
``` 
failed with the following error message:
```
Invalid duration should be rejected  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.