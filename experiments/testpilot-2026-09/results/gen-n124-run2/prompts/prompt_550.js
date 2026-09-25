The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.lte', function(done) {
        // number schema with .lte (alias .max)
        const numSchema = zod.z.number().lte(5);
        // values that should pass
        assert.doesNotThrow(() => numSchema.parse(5));
        assert.doesNotThrow(() => numSchema.parse(0));
        assert.doesNotThrow(() => numSchema.parse(-10));
        // value that should fail
        assert.throws(() => numSchema.parse(6), /Invalid/);

        // alias test: .max should behave the same as .lte
        const maxSchema = zod.z.number().max(5);
        assert.doesNotThrow(() => maxSchema.parse(5));
        assert.throws(() => maxSchema.parse(6), /Invalid/);

        // bigint schema with .lte
        const bigIntSchema = zod.z.bigint().lte(10n);
        assert.doesNotThrow(() => bigIntSchema.parse(10n));
        assert.doesNotThrow(() => bigIntSchema.parse(0n));
        assert.throws(() => bigIntSchema.parse(11n), /Invalid/);

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
  '    "maximum": 5,\n' +
  '    "inclusive": true,\n' +
  '    "path": [],\n' +
  '    "message": "Too big: expected number to be <=5"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.