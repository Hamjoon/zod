The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.prefault', function(done) {
        // Define an inner schema that expects a string of at least 3 characters
        const innerSchema = zod.z.string().min(3);
        // Create a prefault schema with a default value
        const schema = zod.z.prefault(innerSchema, 'default-value');

        // Valid input should pass through unchanged
        const validResult = schema.parse('hello');
        assert.strictEqual(validResult, 'hello');

        // Invalid input (too short) should fall back to the default value
        const invalidResult = schema.parse('hi');
        assert.strictEqual(invalidResult, 'default-value');

        // Also ensure that non‑string input falls back to the default
        const nonStringResult = schema.parse(123);
        assert.strictEqual(nonStringResult, 'default-value');

        done();
    });
});
``` 
failed with the following error message:
```
[
  {
    "origin": "string",
    "code": "too_small",
    "minimum": 3,
    "inclusive": true,
    "path": [],
    "message": "Too small: expected string to have >=3 characters"
  }
]  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.