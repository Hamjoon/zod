The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.bigint', function(done) {
        // Create a bigint schema using the function under test
        const schema = zod.z.bigint();

        // Valid bigint should be parsed unchanged
        assert.strictEqual(schema.parse(42n), 42n);

        // Non‑bigint values should throw a validation error
        assert.throws(() => schema.parse(42), /Expected bigint/);
        assert.throws(() => schema.parse("42"), /Expected bigint/);
        assert.throws(() => schema.parse(null), /Expected bigint/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Expected bigint/. Input:

'[\n' +
  '  {\n' +
  '    "expected": "bigint",\n' +
  '    "code": "invalid_type",\n' +
  '    "path": [],\n' +
  '    "message": "Invalid input: expected bigint, received number"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.