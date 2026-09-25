The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.string', function(done) {
        // Create a string schema (no params needed for basic behavior)
        const schema = zod.z.string();

        // Valid string should parse correctly
        const result = schema.parse('hello world');
        assert.strictEqual(result, 'hello world');

        // Invalid (non‑string) values should throw a ZodError
        assert.throws(() => {
            schema.parse(42);
        }, /Expected string/);

        // Another invalid case: null
        assert.throws(() => {
            schema.parse(null);
        }, /Expected string/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Expected string/. Input:

'[\n' +
  '  {\n' +
  '    "expected": "string",\n' +
  '    "code": "invalid_type",\n' +
  '    "path": [],\n' +
  '    "message": "Invalid input: expected string, received number"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.