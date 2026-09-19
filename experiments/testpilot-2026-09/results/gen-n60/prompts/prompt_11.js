The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.number', function(done) {
        // Basic number schema
        const numSchema = zod.z.number();
        assert.strictEqual(numSchema.parse(42), 42);
        assert.strictEqual(numSchema.parse(0), 0);
        assert.throws(() => numSchema.parse('42'), zod.ZodError);
        assert.throws(() => numSchema.parse(null), zod.ZodError);

        // Number schema with custom error messages
        const customSchema = zod.z.number({
            required_error: "Number required",
            invalid_type_error: "Not a number"
        });

        // Missing value should trigger required_error
        assert.throws(() => customSchema.parse(undefined), (err) => {
            return err instanceof zod.ZodError &&
                err.errors.some(e => e.message === "Number required");
        });

        // Wrong type should trigger invalid_type_error
        assert.throws(() => customSchema.parse('abc'), (err) => {
            return err instanceof zod.ZodError &&
                err.errors.some(e => e.message === "Not a number");
        });

        done();
    });
});
``` 
failed with the following error message:
```
Cannot read properties of undefined (reading 'some')  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.