The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.intersection', function(done) {
        // Create an intersection of two object schemas
        const schema = zod.object({ a: zod.string() })
                           .intersection(zod.object({ b: zod.number() }));

        // ---- Valid case ----------------------------------------------------
        const validInput = { a: 'hello', b: 123 };
        const parsedValid = schema.parse(validInput);
        assert.deepStrictEqual(parsedValid, validInput, 'Intersection should accept values satisfying both schemas');

        // ---- Invalid cases --------------------------------------------------
        // Missing property from the right schema
        assert.throws(
            () => schema.parse({ a: 'hello' }),
            /Required/,
            'Intersection should reject when a required property from the right schema is missing'
        );

        // Wrong type for a property from the right schema
        assert.throws(
            () => schema.parse({ a: 'hello', b: 'not-a-number' }),
            /Expected number/,
            'Intersection should reject when a property does not match the right schema type'
        );

        // ---- Unknown keys are stripped (default Zod behavior) -------------
        const inputWithExtra = { a: 'hi', b: 42, extra: true };
        const parsedExtra = schema.parse(inputWithExtra);
        assert.deepStrictEqual(
            parsedExtra,
            { a: 'hi', b: 42 },
            'Intersection should strip unknown keys by default'
        );

        done();
    });
});
``` 
failed with the following error message:
```
zod.object(...).intersection is not a function  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.