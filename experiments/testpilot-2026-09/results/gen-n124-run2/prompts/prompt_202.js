The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.int', function(done) {
        // Create an integer schema (safe integer range)
        const intSchema = zod.z.int();

        // Valid integer should parse without error
        assert.doesNotThrow(() => {
            const result = intSchema.parse(42);
            assert.strictEqual(result, 42);
        });

        // Non‑integer numbers should be rejected
        assert.throws(() => intSchema.parse(3.14), /Expected integer/);
        assert.throws(() => intSchema.parse(-2.7), /Expected integer/);

        // Values outside the safe‑integer range should be rejected
        assert.throws(() => intSchema.parse(Number.MAX_SAFE_INTEGER + 1), /Expected integer/);
        assert.throws(() => intSchema.parse(Number.MIN_SAFE_INTEGER - 1), /Expected integer/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Expected integer/. Input:

'[\n' +
  '  {\n' +
  '    "expected": "int",\n' +
  '    "format": "safeint",\n' +
  '    "code": "invalid_type",\n' +
  '    "path": [],\n' +
  '    "message": "Invalid input: expected int, received number"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.