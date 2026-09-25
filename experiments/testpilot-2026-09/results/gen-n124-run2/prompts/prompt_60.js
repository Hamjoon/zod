The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.stringbool', function(done) {
        // Create the schema using the stringbool helper
        const schema = zod.z.stringbool();

        // Valid string inputs should be transformed to booleans
        assert.strictEqual(schema.parse('true'), true, "String 'true' should parse to true");
        assert.strictEqual(schema.parse('false'), false, "String 'false' should parse to false");

        // Booleans should pass through unchanged
        assert.strictEqual(schema.parse(true), true, "Boolean true should remain true");
        assert.strictEqual(schema.parse(false), false, "Boolean false should remain false");

        // Invalid values should cause a validation error
        assert.throws(() => schema.parse('yes'), /invalid/i, "Invalid string should throw");
        assert.throws(() => schema.parse(123), /invalid/i, "Non‑string/non‑boolean should throw");

        done();
    });
});
``` 
failed with the following error message:
```
[
  {
    "expected": "string",
    "code": "invalid_type",
    "path": [],
    "message": "Invalid input: expected string, received boolean"
  }
]  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.