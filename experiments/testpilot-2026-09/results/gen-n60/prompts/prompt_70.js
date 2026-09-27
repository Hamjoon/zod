The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.tuple', function(done) {
        // 1. Simple tuple without rest
        const simpleTuple = zod.z.tuple([zod.z.string(), zod.z.number()]);
        // valid case
        assert.deepStrictEqual(simpleTuple.parse(['hello', 123]), ['hello', 123]);
        // invalid case – missing the second element
        assert.throws(() => simpleTuple.parse(['hello']), /Expected number/);

        // 2. Tuple with a rest element (rest is a ZodType)
        const restTuple = zod.z.tuple([zod.z.string()], zod.z.number());
        // valid with only the required element
        assert.deepStrictEqual(restTuple.parse(['onlyString']), ['onlyString']);
        // valid with additional rest elements
        assert.deepStrictEqual(restTuple.parse(['first', 1, 2, 3]), ['first', 1, 2, 3]);
        // invalid – rest element of wrong type
        assert.throws(() => restTuple.parse(['first', 'notNumber']), /Expected number/);

        // 3. Tuple with custom params (no rest)
        const paramsTuple = zod.z.tuple([zod.z.boolean()], { description: 'boolean tuple' });
        // params should not affect parsing
        assert.deepStrictEqual(paramsTuple.parse([true]), [true]);
        // ensure the description is stored (Zod exposes it via .description)
        assert.strictEqual(paramsTuple.description, 'boolean tuple');

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Expected number/. Input:

'[\n' +
  '  {\n' +
  '    "expected": "number",\n' +
  '    "code": "invalid_type",\n' +
  '    "path": [\n' +
  '      1\n' +
  '    ],\n' +
  '    "message": "Invalid input: expected number, received undefined"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.