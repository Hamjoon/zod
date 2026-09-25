The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.boolean', function(done) {
        // Create a boolean schema
        const schema = zod.z.boolean();

        // Valid booleans should parse unchanged
        assert.strictEqual(schema.parse(true), true);
        assert.strictEqual(schema.parse(false), false);

        // Invalid values should throw a ZodError containing the expected message
        assert.throws(() => schema.parse(1), /Expected boolean/);
        assert.throws(() => schema.parse('true'), /Expected boolean/);
        assert.throws(() => schema.parse(null), /Expected boolean/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Expected boolean/. Input:

'[\n' +
  '  {\n' +
  '    "expected": "boolean",\n' +
  '    "code": "invalid_type",\n' +
  '    "path": [],\n' +
  '    "message": "Invalid input: expected boolean, received number"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.