The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.int64', function(done) {
        // Create an int64 schema. No special params are required for the basic range.
        const schema = zod.z.int64({});

        // Values that should be accepted (within signed 64‑bit range)
        assert.doesNotThrow(() => schema.parse(0), '0 should be valid');
        assert.doesNotThrow(() => schema.parse(42), 'positive small number should be valid');
        assert.doesNotThrow(() => schema.parse(-42), 'negative small number should be valid');
        assert.doesNotThrow(() => schema.parse(9223372036854775807), 'max int64 should be valid');
        assert.doesNotThrow(() => schema.parse(-9223372036854775808), 'min int64 should be valid');

        // Values that should be rejected (outside signed 64‑bit range)
        assert.throws(() => schema.parse(9223372036854775808), /Invalid|out of range/, 'value > max int64 should be invalid');
        assert.throws(() => schema.parse(-9223372036854775809), /Invalid|out of range/, 'value < min int64 should be invalid');

        // Non‑numeric values should also be rejected
        assert.throws(() => schema.parse('123'), /Invalid|expected/, 'string should be invalid');
        assert.throws(() => schema.parse(null), /Invalid|expected/, 'null should be invalid');
        assert.throws(() => schema.parse(undefined), /Invalid|expected/, 'undefined should be invalid');

        done();
    });
});
``` 
failed with the following error message:
```
Got unwanted exception: 0 should be valid
Actual message: "[
  {
    "expected": "bigint",
    "code": "invalid_type",
    "path": [],
    "message": "Invalid input: expected bigint, received number"
  }
]"  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.