The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nonoptional', function(done) {
        // Create an optional string schema
        const optionalString = zod.z.string().optional();

        // Convert it to a non‑optional schema using the static helper
        const nonOptional = zod.z.nonoptional(optionalString);

        // 1. Parsing a valid string should succeed
        assert.doesNotThrow(() => {
            const result = nonOptional.parse('hello world');
            assert.strictEqual(result, 'hello world');
        });

        // 2. Parsing undefined should throw a validation error
        assert.throws(() => {
            nonOptional.parse(undefined);
        }, /required|undefined/);

        // 3. Ensure the schema type is still a string (the inner type is preserved)
        assert.strictEqual(nonOptional._def.innerType._def.typeName, 'ZodString');

        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly equal:
+ actual - expected

+ undefined
- 'ZodString'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.