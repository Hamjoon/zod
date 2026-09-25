The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.undefined', function(done) {
        // Create the undefined schema using the function under test
        const schema = zod.z.undefined();

        // The returned object should be an instance of ZodUndefined
        assert(schema instanceof zod.ZodUndefined, 'schema should be an instance of ZodUndefined');

        // Parsing `undefined` should succeed and return `undefined`
        assert.strictEqual(schema.parse(undefined), undefined, 'parse(undefined) should return undefined');

        // Parsing any other value should throw a validation error
        assert.throws(() => schema.parse(null), /Expected undefined/);
        assert.throws(() => schema.parse(0), /Expected undefined/);
        assert.throws(() => schema.parse(''), /Expected undefined/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Expected undefined/. Input:

'[\n' +
  '  {\n' +
  '    "expected": "undefined",\n' +
  '    "code": "invalid_type",\n' +
  '    "path": [],\n' +
  '    "message": "Invalid input: expected undefined, received null"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.