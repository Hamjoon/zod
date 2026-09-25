The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.void', function(done) {
        // Basic void schema should accept undefined and reject everything else
        const voidSchema = zod.z.void();

        // Valid case
        assert.strictEqual(voidSchema.parse(undefined), undefined);

        // Invalid cases – should throw with the default error message
        assert.throws(() => voidSchema.parse(null), /Expected void/);
        assert.throws(() => voidSchema.parse(0), /Expected void/);
        assert.throws(() => voidSchema.parse(''), /Expected void/);

        // Custom error message via params
        const customVoid = zod.z.void({ invalid_type_error: "Not void" });
        assert.throws(() => customVoid.parse('test'), /Not void/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Expected void/. Input:

'[\n' +
  '  {\n' +
  '    "expected": "void",\n' +
  '    "code": "invalid_type",\n' +
  '    "path": [],\n' +
  '    "message": "Invalid input: expected void, received null"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.