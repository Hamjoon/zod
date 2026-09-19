The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.looseObject', function() {
        // Create a loose object schema with a single required string property
        const schema = zod.z.looseObject({ name: zod.string() });

        // Input contains the required property plus an extra key
        const input = { name: 'Yeller', extraKey: true };

        // Parsing should succeed and retain the extra key
        const result = schema.parse(input);
        assert.deepStrictEqual(result, input, 'Loose object should preserve extra keys');

        // The shape getter should expose the defined shape
        assert.ok(schema.shape, 'Schema should have a shape property');
        assert.strictEqual(typeof schema.shape.name, 'function', 'Shape should contain the defined property');

        // Invalid type for the defined property should throw a ZodError
        assert.throws(
            () => schema.parse({ name: 123, extraKey: true }),
            zod.ZodError,
            'Parsing should fail when a defined property has the wrong type'
        );
    });
});
``` 
failed with the following error message:
```
Shape should contain the defined property
+ actual - expected

+ 'object'
- 'function'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.