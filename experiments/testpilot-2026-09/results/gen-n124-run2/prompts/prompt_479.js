The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.readonly', function(done) {
        // Create a simple inner schema
        const inner = zod.z.string();

        // Apply readonly to the inner schema
        const readonlySchema = zod.z.readonly(inner);

        // Verify that the returned schema is a ZodReadonly instance
        // Zod exposes the type name via the _def property
        assert.strictEqual(readonlySchema._def.typeName, 'ZodReadonly');

        // Verify that the inner type is correctly stored
        assert.strictEqual(readonlySchema.innerType, inner);

        // Ensure parsing works as expected
        const parsed = readonlySchema.parse('hello world');
        assert.strictEqual(parsed, 'hello world');

        // The readonly wrapper should not alter the parsed value
        // (readonly is a TypeScript compile‑time feature, not runtime)
        // So we just confirm the value is unchanged
        assert.deepStrictEqual(parsed, 'hello world');

        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly equal:
+ actual - expected

+ undefined
- 'ZodReadonly'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.