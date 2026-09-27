The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
        // Define a discriminated union schema with discriminator key "type"
        const UnionSchema = zod.z.discriminatedUnion('type', [
            zod.z.object({ type: zod.z.literal('a'), a: zod.z.string() }),
            zod.z.object({ type: zod.z.literal('b'), b: zod.z.number() })
        ]);

        // ---- Valid cases ----------------------------------------------------
        // Should parse correctly when the discriminator matches the shape
        const parsedA = UnionSchema.parse({ type: 'a', a: 'hello' });
        assert.deepStrictEqual(parsedA, { type: 'a', a: 'hello' });

        const parsedB = UnionSchema.parse({ type: 'b', b: 42 });
        assert.deepStrictEqual(parsedB, { type: 'b', b: 42 });

        // ---- Invalid cases --------------------------------------------------
        // Missing discriminator key
        assert.throws(() => {
            UnionSchema.parse({ a: 'hello' });
        }, /required/);

        // Discriminator value not defined in the union
        assert.throws(() => {
            UnionSchema.parse({ type: 'c', c: true });
        }, /Invalid discriminator value/);

        // Correct discriminator but wrong property type
        assert.throws(() => {
            UnionSchema.parse({ type: 'a', a: 123 });
        }, /Expected string/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /required/. Input:

'[\n' +
  '  {\n' +
  '    "code": "invalid_union",\n' +
  '    "errors": [],\n' +
  '    "note": "No matching discriminator",\n' +
  '    "path": [\n' +
  '      "type"\n' +
  '    ],\n' +
  '    "message": "Invalid input"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.