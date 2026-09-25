The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.base64url', function(done) {
        // obtain the validator (the API returns a callable validator)
        const validator = z.base64url();

        // ---- valid base64url strings ----
        const validSamples = [
            // "abc123" encoded without padding
            'YWJjMTIz',
            // "Hello-World" (URL‑safe characters, no padding)
            'SGVsbG8tV29ybGQ',
            // numeric string "1234567890"
            'MTIzNDU2Nzg5MA',
            // empty string is technically a valid base64url representation of empty data
            '',
        ];

        validSamples.forEach(sample => {
            // The validator should return a truthy value for valid inputs
            const result = validator(sample);
            assert(
                result === true || result === undefined || result,
                `Expected valid base64url string "${sample}" to be accepted`
            );
        });

        // ---- invalid base64url strings ----
        const invalidSamples = [
            // Contains illegal character '+'
            'YWJj+MTIz',
            // Contains illegal character '/' (not URL‑safe)
            'YWJj/MTIz',
            // Contains padding characters '=' which are not allowed in base64url
            'YWJjMTIz==',
            // Contains characters outside the base64url alphabet
            '!!!',
            // Not a string (number)
            12345,
            // Null value
            null,
            // Undefined value
            undefined,
        ];

        invalidSamples.forEach(sample => {
            // The validator should return a falsy value for invalid inputs
            const result = validator(sample);
            assert(
                result === false || result === undefined || !result,
                `Expected invalid base64url value "${sample}" to be rejected`
            );
        });

        done();
    });
});
``` 
failed with the following error message:
```
z is not defined  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.