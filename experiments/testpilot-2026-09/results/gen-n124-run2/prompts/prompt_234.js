The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.boolean', function(done) {
        const schema = zod.boolean();

        // Valid boolean values should be parsed unchanged
        assert.strictEqual(schema.parse(true), true);
        assert.strictEqual(schema.parse(false), false);

        // Invalid values should throw a ZodError containing the expected message
        assert.throws(() => schema.parse('true'), /Expected boolean/);
        assert.throws(() => schema.parse(1), /Expected boolean/);
        assert.throws(() => schema.parse(null), /Expected boolean/);
        assert.throws(() => schema.parse(undefined), /Expected boolean/);

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
  '    "message": "Invalid input: expected boolean, received string"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.