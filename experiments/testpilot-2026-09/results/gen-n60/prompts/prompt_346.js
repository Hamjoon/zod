The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.coerce.boolean', function(done) {
        // Create a schema that coerces values to boolean
        const schema = zod.z.coerce.boolean();

        // Values that should be successfully coerced
        const validCases = [
            [true, true],
            [false, false],
            ['true', true],
            ['false', false],
            [1, true],
            [0, false],
            ['1', true],
            ['0', false],
        ];

        // Verify each valid case
        validCases.forEach(([input, expected]) => {
            assert.strictEqual(schema.parse(input), expected, `Failed to coerce ${JSON.stringify(input)}`);
        });

        // Values that should cause a validation error
        const invalidCases = [
            'yes',
            'no',
            2,
            -1,
            null,
            undefined,
            {},
            [],
        ];

        // Verify each invalid case throws
        invalidCases.forEach((input) => {
            assert.throws(() => schema.parse(input), /Invalid input/);
        });

        done();
    });
});
``` 
failed with the following error message:
```
Failed to coerce "false"

true !== false
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.