The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.symbol', function(done) {
        // Basic symbol validation
        const schema = zod.z.symbol();
        const sym = Symbol('mySymbol');
        assert.strictEqual(schema.parse(sym), sym);

        // Non‑symbol values should throw a ZodError
        assert.throws(() => schema.parse('not a symbol'), err => err instanceof zod.ZodError);

        // Custom error messages
        const customSchema = zod.z.symbol({
            required_error: 'Required',
            invalid_type_error: 'Invalid'
        });

        // Missing value triggers required_error
        try {
            customSchema.parse(undefined);
        } catch (e) {
            assert(e instanceof zod.ZodError);
            assert.strictEqual(e.errors[0].message, 'Required');
        }

        // Wrong type triggers invalid_type_error
        try {
            customSchema.parse(123);
        } catch (e) {
            assert(e instanceof zod.ZodError);
            assert.strictEqual(e.errors[0].message, 'Invalid');
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