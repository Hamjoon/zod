The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nonpositive', function(done) {
        // Number schema: should accept values <= 0 and reject > 0
        const numSchema = zod.z.number().nonpositive();
        // Valid cases
        assert.strictEqual(numSchema.parse(0), 0);
        assert.strictEqual(numSchema.parse(-5), -5);
        assert.strictEqual(numSchema.parse(-0.1), -0.1);
        // Invalid cases
        assert.throws(() => numSchema.parse(0.0001), /Invalid/);
        assert.throws(() => numSchema.parse(1), /Invalid/);
        assert.throws(() => numSchema.parse(100), /Invalid/);

        // BigInt schema: should accept values <= 0n and reject > 0n
        const bigSchema = zod.z.bigint().nonpositive();
        // Valid cases
        assert.strictEqual(bigSchema.parse(0n), 0n);
        assert.strictEqual(bigSchema.parse(-10n), -10n);
        // Invalid cases
        assert.throws(() => bigSchema.parse(1n), /Invalid/);
        assert.throws(() => bigSchema.parse(123n), /Invalid/);

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
  '    "code": "too_big",\n' +
  '    "maximum": 0,\n' +
  '    "inclusive": true,\n' +
  '    "path": [],\n' +
  '    "message": "Too big: expected number to be <=0"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.