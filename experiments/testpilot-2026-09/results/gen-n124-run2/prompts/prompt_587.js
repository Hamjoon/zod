The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nonpositive', function(done) {
        // Create a number schema that only allows non‑positive values (<= 0)
        const schema = zod.z.number().nonpositive();

        // Valid cases: negative numbers and zero should pass
        assert.strictEqual(schema.parse(-10), -10);
        assert.strictEqual(schema.parse(0), 0);

        // Invalid case: any positive number should throw a ZodError
        assert.throws(
            () => schema.parse(5),
            err => err instanceof zod.ZodError && /must be less than or equal to 0/.test(err.message)
        );

        // Also ensure non‑numeric values are rejected
        assert.throws(
            () => schema.parse("not a number"),
            err => err instanceof zod.ZodError
        );

        done();
    });
});
``` 
failed with the following error message:
```
The validation function is expected to return "true". Received false

Caught error:

[
  {
    "origin": "number",
    "code": "too_big",
    "maximum": 0,
    "inclusive": true,
    "path": [],
    "message": "Too big: expected number to be <=0"
  }
]  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.