The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.null', function(done) {
        // basic null schema
        const nullSchema = zod.z.null();
        // should parse null to null
        assert.strictEqual(nullSchema.parse(null), null);
        // should reject non‑null values
        assert.throws(() => nullSchema.parse(undefined), /Expected null/);
        assert.throws(() => nullSchema.parse(123), /Expected null/);
        assert.throws(() => nullSchema.parse('string'), /Expected null/);
        assert.throws(() => nullSchema.parse(true), /Expected null/);

        // custom error message via params
        const customSchema = zod.z.null({ invalid_type_error: 'Value must be null!' });
        try {
            customSchema.parse(42);
        } catch (e) {
            // Zod throws a ZodError with an `errors` array
            assert(Array.isArray(e.errors), 'ZodError should contain an errors array');
            assert.strictEqual(e.errors[0].message, 'Value must be null!');
        }

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Expected null/. Input:

'[\n' +
  '  {\n' +
  '    "expected": "null",\n' +
  '    "code": "invalid_type",\n' +
  '    "path": [],\n' +
  '    "message": "Invalid input: expected null, received undefined"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.