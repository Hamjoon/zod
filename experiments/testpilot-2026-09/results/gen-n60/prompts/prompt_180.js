The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.uint32', function(done) {
        // Create the uint32 schema
        const schema = zod.z.uint32();

        // Valid values should parse without throwing
        assert.doesNotThrow(() => schema.parse(0));
        assert.doesNotThrow(() => schema.parse(123));
        assert.doesNotThrow(() => schema.parse(4294967295));

        // Invalid values should throw a ZodError
        assert.throws(() => schema.parse(-1), /ZodError/);
        assert.throws(() => schema.parse(4294967296), /ZodError/);
        assert.throws(() => schema.parse('123'), /ZodError/);
        assert.throws(() => schema.parse(null), /ZodError/);
        assert.throws(() => schema.parse(undefined), /ZodError/);
        assert.throws(() => schema.parse(NaN), /ZodError/);
        assert.throws(() => schema.parse(Infinity), /ZodError/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /ZodError/. Input:

'[\n' +
  '  {\n' +
  '    "origin": "number",\n' +
  '    "code": "too_small",\n' +
  '    "minimum": 0,\n' +
  '    "inclusive": true,\n' +
  '    "path": [],\n' +
  '    "message": "Too small: expected number to be >=0"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.