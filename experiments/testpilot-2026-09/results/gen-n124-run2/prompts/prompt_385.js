The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.set', function(done) {
        // Create a Set schema that expects strings
        const setSchema = zod.z.set(zod.z.string(), "Bad set!");

        // The returned schema should be an instance of ZodSet
        assert(setSchema instanceof zod.ZodSet, 'setSchema should be an instance of ZodSet');

        // Valid Set should parse correctly
        const goodSet = new Set(['foo', 'bar']);
        const parsedGood = setSchema.parse(goodSet);
        assert(parsedGood instanceof Set, 'Parsed value should be a Set');
        assert.deepStrictEqual(Array.from(parsedGood), Array.from(goodSet), 'Parsed Set should equal the original');

        // Invalid element type (number instead of string) should throw
        assert.throws(() => {
            setSchema.parse(new Set([1, 2]));
        }, /Bad set!|Invalid set element/, 'Parsing a Set with wrong element type should throw');

        // Non‑Set input should also throw
        assert.throws(() => {
            setSchema.parse(['foo', 'bar']);
        }, /Bad set!|Expected set/, 'Parsing a non‑Set should throw');

        // .readonly() should produce a readonly ZodSet
        const readonlySchema = setSchema.readonly();
        assert(readonlySchema instanceof zod.ZodSet, 'readonlySchema should be an instance of ZodSet');
        // The internal definition should mark it as readonly
        assert.strictEqual(readonlySchema._def.readonly, true, 'readonly flag should be true');

        // Parsing with the readonly schema should still succeed
        const parsedReadonly = readonlySchema.parse(goodSet);
        assert(parsedReadonly instanceof Set, 'Parsed readonly value should be a Set');
        assert.deepStrictEqual(Array.from(parsedReadonly), Array.from(goodSet), 'Readonly parsed Set should equal the original');

        done();
    });
});
``` 
failed with the following error message:
```
Parsing a Set with wrong element type should throw  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.