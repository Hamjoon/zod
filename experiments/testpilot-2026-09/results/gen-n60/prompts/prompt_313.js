The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nonpositive', function(done) {
        // Create a schema that only allows non‑positive numbers (<= 0)
        const schema = zod.z.number().nonpositive();

        // Values that should pass validation
        assert.strictEqual(schema.parse(0), 0);
        assert.strictEqual(schema.parse(-5), -5);
        assert.strictEqual(schema.parse(-0.1), -0.1);

        // Values that should fail validation
        assert.throws(() => schema.parse(1), /Invalid/);
        assert.throws(() => schema.parse(0.1), /Invalid/);

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