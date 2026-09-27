The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.trim', function(done) {
        // 1. Trim should remove surrounding whitespace before other checks
        const trimmedSchema = zod.string().trim().min(3);
        assert.strictEqual(trimmedSchema.parse('  abc  '), 'abc');
        // after trimming, length is 3, so min(3) passes
        assert.throws(() => trimmedSchema.parse('  ab  '), /String must contain at least 3 character/);

        // 2. Order of .trim() and .default() matters
        // a) .trim() before .default() – default value is NOT trimmed
        const schemaTrimThenDefault = zod.string().trim().default('  tuna  ');
        assert.strictEqual(schemaTrimThenDefault.parse(undefined), '  tuna  ');

        // b) .default() before .trim() – default value IS trimmed
        const schemaDefaultThenTrim = zod.string().default('  tuna  ').trim();
        assert.strictEqual(schemaDefaultThenTrim.parse(undefined), 'tuna');

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /String must contain at least 3 character/. Input:

'[\n' +
  '  {\n' +
  '    "origin": "string",\n' +
  '    "code": "too_small",\n' +
  '    "minimum": 3,\n' +
  '    "inclusive": true,\n' +
  '    "path": [],\n' +
  '    "message": "Too small: expected string to have >=3 characters"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.