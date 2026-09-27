The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.boolean', function(done) {
        // Create a boolean schema using Zod
        const boolSchema = zod.z.boolean();

        // Valid boolean values should parse correctly
        assert.strictEqual(boolSchema.parse(true), true);
        assert.strictEqual(boolSchema.parse(false), false);

        // Invalid values should throw a ZodError
        assert.throws(() => boolSchema.parse(1), /ZodError/);
        assert.throws(() => boolSchema.parse('true'), /ZodError/);
        assert.throws(() => boolSchema.parse(null), /ZodError/);
        assert.throws(() => boolSchema.parse(undefined), /ZodError/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /ZodError/. Input:

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