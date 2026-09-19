The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
        // Define two discriminated object schemas
        const schemaA = zod.z.object({
            type: zod.z.literal('a'),
            a: zod.z.string()
        });
        const schemaB = zod.z.object({
            type: zod.z.literal('b'),
            b: zod.z.number()
        });

        // Create the discriminated union schema
        const unionSchema = zod.z.discriminatedUnion('type', [schemaA, schemaB]);

        // Valid cases
        const parsedA = unionSchema.parse({ type: 'a', a: 'hello' });
        assert.deepStrictEqual(parsedA, { type: 'a', a: 'hello' });

        const parsedB = unionSchema.parse({ type: 'b', b: 42 });
        assert.deepStrictEqual(parsedB, { type: 'b', b: 42 });

        // Invalid cases
        assert.throws(() => {
            unionSchema.parse({ type: 'a', a: 123 }); // a should be string
        }, /Expected string/);

        assert.throws(() => {
            unionSchema.parse({ type: 'c', c: true }); // unknown discriminator
        }, /Invalid discriminator value/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Expected string/. Input:

'[\n' +
  '  {\n' +
  '    "expected": "string",\n' +
  '    "code": "invalid_type",\n' +
  '    "path": [\n' +
  '      "a"\n' +
  '    ],\n' +
  '    "message": "Invalid input: expected string, received number"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.