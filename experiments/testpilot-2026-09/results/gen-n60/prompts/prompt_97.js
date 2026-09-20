The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.array', function(done) {
        // Define an array schema of strings with custom error messages
        const schema = zod.z.array(zod.z.string(), {
            required_error: "Array required",
            invalid_type_error: "Not an array"
        });

        // 1. Valid array should parse correctly
        const validInput = ["foo", "bar"];
        const parsed = schema.parse(validInput);
        assert.deepStrictEqual(parsed, validInput, "Valid array should be returned unchanged");

        // 2. Passing a non‑array should throw the custom invalid_type_error
        assert.throws(
            () => schema.parse("not an array"),
            err => err instanceof zod.ZodError && /Not an array/.test(err.message),
            "Non‑array input should trigger invalid_type_error"
        );

        // 3. Passing an array with an invalid element should throw a ZodError for that element
        assert.throws(
            () => schema.parse(["valid", 123]),
            err => err instanceof zod.ZodError && /Expected string, received number/.test(err.message),
            "Array containing a non‑string should trigger element validation error"
        );

        done();
    });
});
``` 
failed with the following error message:
```
Non‑array input should trigger invalid_type_error  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.