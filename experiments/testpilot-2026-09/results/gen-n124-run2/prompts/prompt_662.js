The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.lowercase', function(done) {
        // Create a string schema that applies the lowercase transformation
        const schema = zod.z.string().lowercase();

        // The transformation should convert uppercase input to lowercase
        const result = schema.parse('HeLLo WoRLd');
        assert.strictEqual(result, 'hello world');

        // Non‑string values should cause a validation error
        assert.throws(() => {
            schema.parse(12345);
        }, /Expected string/);

        done();
    });
});
``` 
failed with the following error message:
```
[
  {
    "origin": "string",
    "code": "invalid_format",
    "format": "lowercase",
    "pattern": "/^[^A-Z]*$/",
    "path": [],
    "message": "Invalid lowercase"
  }
]  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.