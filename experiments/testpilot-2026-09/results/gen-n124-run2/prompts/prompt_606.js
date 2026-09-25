The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.maxSize', function(done) {
        // 1. Verify that the check object returned by z.maxSize has the correct shape
        const max = 5;
        const check = z.maxSize(max);
        // The check should be an object with a `check` property equal to "max_size"
        assert.strictEqual(check.check, 'max_size', 'check type should be "max_size"');
        // It should store the provided maximum value
        assert.strictEqual(check.maximum, max, 'maximum should be the value passed to maxSize');

        // 2. Use the check in a real schema (string length) and ensure it validates correctly
        // Build a schema that only accepts strings with length <= 5
        const schema = z.set(z.string()).check(z.maxSize(5));

        // Valid case: length exactly 5 (should pass)
        assert.doesNotThrow(() => {
            // Most Zod‑like libraries expose a `parse` method for validation
            // If `parse` is not available, fall back to `validate` which returns an object
            if (typeof schema.parse === 'function') {
                schema.parse('abcde');
            } else if (typeof schema.validate === 'function') {
                const result = schema.validate('abcde');
                if (result.error) throw result.error;
            } else {
                throw new Error('No validation method found on schema');
            }
        }, 'String of length 5 should pass maxSize(5)');

        // Valid case: shorter string (should also pass)
        assert.doesNotThrow(() => {
            if (typeof schema.parse === 'function') {
                schema.parse('abc');
            } else if (typeof schema.validate === 'function') {
                const result = schema.validate('abc');
                if (result.error) throw result.error;
            }
        }, 'String shorter than maxSize should pass');

        // Invalid case: length greater than 5 (should throw)
        let threw = false;
        try {
            if (typeof schema.parse === 'function') {
                schema.parse('abcdef');
            } else if (typeof schema.validate === 'function') {
                const result = schema.validate('abcdef');
                if (result.error) throw result.error;
            } else {
                throw new Error('No validation method found on schema');
            }
        } catch (e) {
            threw = true;
            // The error message should contain something about max size
            assert.ok(/max_size/.test(e.message) || /maximum/.test(e.message), 'Error should mention max size constraint');
        }
        assert.ok(threw, 'String longer than maxSize should cause a validation error');

        done();
    });
});
``` 
failed with the following error message:
```
z is not defined  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.