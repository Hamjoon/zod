The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nan', function(done) {
        // ✅ Should parse NaN successfully
        const parsed = zod.nan().parse(NaN);
        assert.ok(Number.isNaN(parsed), 'Parsing NaN should succeed');

        // ❌ Should reject non‑NaN values
        assert.throws(() => {
            zod.nan().parse(123);
        }, err => err instanceof zod.ZodError, 'Parsing non‑NaN should throw ZodError');

        // ✅ Custom error messages
        const schema = zod.nan({
            required_error: "isNaN is required",
            invalid_type_error: "isNaN must be 'not a number'",
        });

        // required_error when value is undefined
        try {
            schema.parse(undefined);
        } catch (e) {
            assert(e instanceof zod.ZodError);
            assert.strictEqual(e.errors[0].message, "isNaN is required");
        }

        // invalid_type_error when value is not NaN
        try {
            schema.parse(0);
        } catch (e) {
            assert(e instanceof zod.ZodError);
            assert.strictEqual(e.errors[0].message, "isNaN must be 'not a number'");
        }

        done();
    });
});
``` 
failed with the following error message:
```
Cannot read properties of undefined (reading '0')  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.