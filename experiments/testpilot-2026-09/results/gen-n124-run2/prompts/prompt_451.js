The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nonoptional', function(done) {
        // Create a non‑optional string schema using the static helper
        const schema = zod.z.nonoptional(zod.string());

        // A valid string should parse correctly
        assert.strictEqual(schema.parse('hello world'), 'hello world');

        // `undefined` (or missing) should be rejected because the schema is non‑optional
        assert.throws(() => schema.parse(undefined), /Required/);

        // Also ensure that `null` is rejected (non‑optional does not make it nullable)
        assert.throws(() => schema.parse(null), /Expected string, received null/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Required/. Input:

'[\n' +
  '  {\n' +
  '    "expected": "string",\n' +
  '    "code": "invalid_type",\n' +
  '    "path": [],\n' +
  '    "message": "Invalid input: expected string, received undefined"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.