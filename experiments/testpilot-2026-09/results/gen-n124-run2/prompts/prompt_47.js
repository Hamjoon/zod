The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.coerce.bigint', function(done) {
        // Create a schema that coerces values to bigint
        const schema = zod.z.coerce.bigint();

        // Valid coercions
        assert.strictEqual(schema.parse('123'), 123n, 'String "123" should be coerced to 123n');
        assert.strictEqual(schema.parse(456), 456n, 'Number 456 should be coerced to 456n');
        assert.strictEqual(schema.parse(789n), 789n, 'BigInt 789n should remain 789n');

        // Invalid coercion should throw a ZodError
        assert.throws(
            () => schema.parse('not-a-number'),
            (err) => {
                // Zod errors contain a `issues` array; we just check the message contains expected text
                return err && err.message && /Expected bigint/.test(err.message);
            },
            'Parsing a non‑numeric string should throw a ZodError'
        );

        done();
    });
});
``` 
failed with the following error message:
```
Parsing a non‑numeric string should throw a ZodError  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.