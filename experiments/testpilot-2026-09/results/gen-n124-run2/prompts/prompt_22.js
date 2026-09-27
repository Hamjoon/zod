The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.iso.duration', function(done) {
        // Create the ISO duration schema
        const durationSchema = zod.z.iso.duration();

        // A set of valid ISO 8601 duration strings
        const validDurations = [
            'P1Y',               // 1 year
            'P2M',               // 2 months
            'P3W',               // 3 weeks
            'P4D',               // 4 days
            'PT5H',              // 5 hours
            'PT6M',              // 6 minutes
            'PT7S',              // 7 seconds
            'P1Y2M3DT4H5M6S',    // full representation
            'P0.5Y',             // fractional year
            'PT0.75H'            // fractional hour
        ];

        // Ensure all valid strings pass validation
        validDurations.forEach(str => {
            assert.doesNotThrow(() => durationSchema.parse(str), `Valid duration "${str}" threw`);
        });

        // A set of invalid strings that should fail validation
        const invalidDurations = [
            '',
            'P',
            'PT',
            '1Y2M',
            'P-1Y',
            'P1Y2M3D4H5M6S',   // missing 'T' before time component
            'P1Y2M3DT4H5M6',    // missing 'S' at the end
            'P1Y2M3DT4H5M6Sextra',
            'Duration',
            '2021-01-01'        // a date, not a duration
        ];

        // Ensure all invalid strings throw a validation error
        invalidDurations.forEach(str => {
            assert.throws(() => durationSchema.parse(str), `Invalid duration "${str}" did not throw`);
        });

        done();
    });
});
``` 
failed with the following error message:
```
Got unwanted exception: Valid duration "P0.5Y" threw
Actual message: "[
  {
    "origin": "string",
    "code": "invalid_format",
    "format": "duration",
    "pattern": "/^P(?:(\\d+W)|(?!.*W)(?=\\d|T\\d)(\\d+Y)?(\\d+M)?(\\d+D)?(T(?=\\d)(\\d+H)?(\\d+M)?(\\d+([.,]\\d+)?S)?)?)$/",
    "path": [],
    "message": "Invalid ISO duration"
  }
]"  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.