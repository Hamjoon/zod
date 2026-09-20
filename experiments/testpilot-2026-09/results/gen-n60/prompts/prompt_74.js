The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.tuple', function(done) {
        // ---------- Fixed‑length tuple ----------
        const athleteSchema = zod.tuple([
            zod.string(),
            zod.number(),
            zod.object({ pointsScored: zod.number() })
        ]);
        const athlete = athleteSchema.parse(['Usain', 9, { pointsScored: 100 }]);
        assert.deepStrictEqual(athlete, ['Usain', 9, { pointsScored: 100 }]);

        // ---------- Tuple with a rest element ----------
        const restSchema = zod.tuple([zod.string()], zod.string());
        const restValue = restSchema.parse(['first', 'second', 'third']);
        assert.deepStrictEqual(restValue, ['first', 'second', 'third']);

        // Invalid data for the rest‑tuple (second element must be a string)
        assert.throws(
            () => restSchema.parse(['onlyOne', 2]),
            /Expected string/
        );

        // ---------- Readonly tuple ----------
        const readonlySchema = zod.tuple([zod.string(), zod.number()]).readonly();
        const readonlyValue = readonlySchema.parse(['hello', 42]);
        assert.deepStrictEqual(readonlyValue, ['hello', 42]);

        // The runtime value is still an array; the readonly aspect is a TypeScript type only.
        // We can at least verify that the schema is indeed a ZodTuple.
        assert.strictEqual(readonlySchema._def.typeName, 'ZodTuple');

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
  '      1\n' +
  '    ],\n' +
  '    "message": "Invalid input: expected string, received number"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.