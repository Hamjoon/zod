The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.void', function(done) {
        // Create a void schema
        const voidSchema = zod.z.void();

        // Parsing undefined should succeed and return undefined
        assert.strictEqual(voidSchema.parse(undefined), undefined);

        // Parsing without an argument is equivalent to parsing undefined
        assert.strictEqual(voidSchema.parse(), undefined);

        // Parsing any other value should throw a ZodError
        assert.throws(() => voidSchema.parse(null), /Expected void/);
        assert.throws(() => voidSchema.parse(0), /Expected void/);
        assert.throws(() => voidSchema.parse(''), /Expected void/);
        assert.throws(() => voidSchema.parse({}), /Expected void/);

        // safeParse should indicate failure for non‑void values
        const safeResult = voidSchema.safeParse('not void');
        assert.strictEqual(safeResult.success, false);
        assert.ok(safeResult.error);

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