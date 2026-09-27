The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.toUpperCase', function(done) {
        // Create a string schema that transforms input to upper case
        const schema = zod.z.string().toUpperCase();

        // Valid string should be transformed to upper case
        const upper = schema.parse('hello world');
        assert.strictEqual(upper, 'HELLO WORLD');

        // Non‑string input should fail validation
        assert.throws(() => {
            schema.parse(123);
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