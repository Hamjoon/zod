The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.coerce.number', function(done) {
        // Create a coercing number schema
        const schema = zod.z.coerce.number();

        // Valid coercions
        assert.strictEqual(schema.parse('42'), 42, 'String "42" should coerce to number 42');
        assert.strictEqual(schema.parse('3.14'), 3.14, 'String "3.14" should coerce to number 3.14');
        assert.strictEqual(schema.parse(0), 0, 'Number 0 should stay 0');
        assert.strictEqual(schema.parse(-7), -7, 'Negative number should stay unchanged');

        // Invalid inputs should throw
        assert.throws(() => schema.parse('not-a-number'), /Expected number/, 'Non‑numeric string should throw');
        assert.throws(() => schema.parse(undefined), /Required/, 'Undefined should throw');
        assert.throws(() => schema.parse(null), /Expected number/, 'Null should throw');

        // Ensure that NaN is not accepted (coercion yields NaN which is invalid)
        assert.throws(() => schema.parse('NaN'), /Expected number/, 'String "NaN" should throw');

        done();
    });
});
``` 
failed with the following error message:
```
Non‑numeric string should throw  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.