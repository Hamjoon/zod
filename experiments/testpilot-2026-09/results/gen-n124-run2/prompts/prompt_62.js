The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.stringbool', function(done) {
        // default stringbool schema
        const strbool = zod.z.stringbool();

        // truthy values should parse to true
        const truthy = ["true", "1", "yes", "on", "y", "enabled"];
        truthy.forEach(val => {
            assert.strictEqual(strbool.parse(val), true, `Expected "${val}" to be true`);
        });

        // falsy values should parse to false
        const falsy = ["false", "0", "no", "off", "n", "disabled"];
        falsy.forEach(val => {
            assert.strictEqual(strbool.parse(val), false, `Expected "${val}" to be false`);
        });

        // any other value should throw a ZodError with code "invalid_value"
        try {
            strbool.parse("maybe");
            // If we get here, the test should fail
            assert.fail('Expected ZodError for invalid value');
        } catch (e) {
            assert(e instanceof zod.ZodError, 'Error should be an instance of ZodError');
            assert(Array.isArray(e.errors), 'ZodError should have an errors array');
            assert.strictEqual(e.errors[0].code, "invalid_value", 'Error code should be "invalid_value"');
        }

        // case‑sensitive schema: only exact matches should succeed
        const caseSensitive = zod.z.stringbool({ case: "sensitive" });

        // exact match works
        assert.strictEqual(caseSensitive.parse("true"), true);
        // different case should fail
        try {
            caseSensitive.parse("True");
            assert.fail('Expected ZodError for case‑sensitive mismatch');
        } catch (e) {
            assert(e instanceof zod.ZodError, 'Error should be an instance of ZodError for case‑sensitive mismatch');
        }

        done();
    });
});
``` 
failed with the following error message:
```
ZodError should have an errors array  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.