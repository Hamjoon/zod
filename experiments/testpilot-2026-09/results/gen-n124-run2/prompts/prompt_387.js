The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.set', function(done) {
        // basic set schema with string values
        const stringSet = zod.set(zod.string());

        // a valid Set should parse correctly
        const validSet = new Set(['foo', 'bar']);
        const parsedValid = stringSet.parse(validSet);
        assert.deepStrictEqual(parsedValid, validSet);

        // an invalid Set (contains non‑string values) should throw
        const invalidSet = new Set([1, 2, 3]);
        assert.throws(() => {
            stringSet.parse(invalidSet);
        }, /Invalid/);

        // custom error message should be used when validation fails
        const customSet = zod.set(zod.string(), "Bad set!");
        assert.throws(() => {
            customSet.parse(invalidSet);
        }, /Bad set!/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Bad set!/. Input:

'[\n' +
  '  {\n' +
  '    "expected": "string",\n' +
  '    "code": "invalid_type",\n' +
  '    "path": [],\n' +
  '    "message": "Invalid input: expected string, received number"\n' +
  '  },\n' +
  '  {\n' +
  '    "expected": "string",\n' +
  '    "code": "invalid_type",\n' +
  '    "path": [],\n' +
  '    "message": "Invalid input: expected string, received number"\n' +
  '  },\n' +
  '  {\n' +
  '    "expected": "string",\n' +
  '    "code": "invalid_type",\n' +
  '    "path": [],\n' +
  '    "message": "Invalid input: expected string, received number"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.