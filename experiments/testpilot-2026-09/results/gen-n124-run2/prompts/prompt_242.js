The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.bigint', function (done) {
        try {
            // Create a schema without any parameters
            const schema = zod.z.bigint();

            // The schema should expose a `parse` method
            assert.strictEqual(typeof schema.parse, 'function', 'schema.parse should be a function');

            // It must correctly accept a BigInt value
            const bigIntValue = 12345678901234567890n;
            assert.strictEqual(schema.parse(bigIntValue), bigIntValue, 'parse should return the same bigint');

            // It must reject values that are not BigInt
            assert.throws(
                () => schema.parse(123),          // number
                /Expected bigint/,                // Zod’s default error contains this phrase
                'parse should throw on non‑bigint values'
            );
            assert.throws(
                () => schema.parse('123'),        // string
                /Expected bigint/,
                'parse should throw on non‑bigint string values'
            );

            // If the implementation supports a coercion option, verify it works.
            // This part is optional – it will simply be skipped if the option does not exist.
            if (typeof schema.coerce === 'function') {
                const coerceSchema = zod.z.bigint({ coerce: true });
                // The coercion should turn a numeric string into a bigint.
                const coerced = coerceSchema.parse('42');
                assert.strictEqual(coerced, 42n, 'coerce option should convert string to bigint');
            }

            done();
        } catch (err) {
            done(err);
        }
    });
});
``` 
failed with the following error message:
```
parse should throw on non‑bigint values  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.