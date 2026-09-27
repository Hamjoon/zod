The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.gt', function(done) {
        // Number schema: should accept values > 5 and reject <= 5
        const numSchema = zod.number().gt(5);
        // Valid case
        assert.doesNotThrow(() => numSchema.parse(6));
        // Edge case: exactly 5 should fail (exclusive)
        assert.throws(() => numSchema.parse(5), /Invalid/);
        // Below threshold should fail
        assert.throws(() => numSchema.parse(4), /Invalid/);
        // Non-number should also fail
        assert.throws(() => numSchema.parse('6'), /Invalid/);

        // BigInt schema: should accept values > 5n and reject <= 5n
        const bigIntSchema = zod.bigint().gt(5n);
        // Valid case
        assert.doesNotThrow(() => bigIntSchema.parse(6n));
        // Edge case: exactly 5n should fail (exclusive)
        assert.throws(() => bigIntSchema.parse(5n), /Invalid/);
        // Below threshold should fail
        assert.throws(() => bigIntSchema.parse(4n), /Invalid/);
        // Non-bigint should also fail
        assert.throws(() => bigIntSchema.parse(6), /Invalid/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Invalid/. Input:

'[\n' +
  '  {\n' +
  '    "origin": "number",\n' +
  '    "code": "too_small",\n' +
  '    "minimum": 5,\n' +
  '    "inclusive": false,\n' +
  '    "path": [],\n' +
  '    "message": "Too small: expected number to be >5"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.