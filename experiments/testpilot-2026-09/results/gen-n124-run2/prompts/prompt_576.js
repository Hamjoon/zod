The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.negative', function(done) {
        // Create a schema that only accepts negative numbers
        const schema = zod.z.number().negative();

        // Should accept a negative number
        assert.doesNotThrow(() => schema.parse(-42));

        // Should reject zero
        assert.throws(() => schema.parse(0), /Invalid/);

        // Should reject a positive number
        assert.throws(() => schema.parse(7), /Invalid/);

        // Should reject non‑numeric values
        assert.throws(() => schema.parse('not a number'), /Invalid/);

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
  '    "inclusive": false,\n' +
  '    "path": [],\n' +
  '    "message": "Too big: expected number to be <0"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.