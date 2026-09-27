The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.array', function(done) {
        // Basic array of strings
        const stringArraySchema = zod.z.array(zod.z.string());

        // Valid case
        const validInput = ['foo', 'bar', 'baz'];
        // Depending on Zod version, use .check (v1) or .parse (v2+)
        if (typeof stringArraySchema.check === 'function') {
            assert.strictEqual(stringArraySchema.check(validInput), true, 'Valid string array should pass');
        } else {
            assert.doesNotThrow(() => stringArraySchema.parse(validInput), 'Valid string array should not throw');
        }

        // Invalid case: contains a number
        const invalidInput = ['foo', 42, 'baz'];
        if (typeof stringArraySchema.check === 'function') {
            assert.strictEqual(stringArraySchema.check(invalidInput), false, 'Array with non‑string should fail');
        } else {
            assert.throws(() => stringArraySchema.parse(invalidInput), /expected string/, 'Array with non‑string should throw');
        }

        // Array with params: minimum length 2
        const minTwoSchema = zod.z.array(zod.z.string(), { min: 2 });

        // Valid: length 3
        if (typeof minTwoSchema.check === 'function') {
            assert.strictEqual(minTwoSchema.check(['a', 'b', 'c']), true, 'Array meeting min length should pass');
        } else {
            assert.doesNotThrow(() => minTwoSchema.parse(['a', 'b', 'c']), 'Array meeting min length should not throw');
        }

        // Invalid: length 1 (below min)
        if (typeof minTwoSchema.check === 'function') {
            assert.strictEqual(minTwoSchema.check(['only']), false, 'Array below min length should fail');
        } else {
            assert.throws(() => minTwoSchema.parse(['only']), /Array must contain at least 2 items/, 'Array below min length should throw');
        }

        done();
    });
});
``` 
failed with the following error message:
```
Cannot read properties of undefined (reading 'onattach')  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.