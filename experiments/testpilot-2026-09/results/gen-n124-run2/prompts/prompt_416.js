The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.transform', function(done) {
        // Create a schema that transforms a string into its length
        const lengthSchema = zod.string().transform(str => str.length);
        // Verify the returned schema is a ZodTransform instance
        assert.ok(lengthSchema instanceof zod.ZodTransform, 'schema should be a ZodTransform');
        // Parse a value and check the transformation result
        const lengthResult = lengthSchema.parse('hello');
        assert.strictEqual(lengthResult, 5, 'transform should return the string length');

        // Create another schema that doubles a number
        const doubleSchema = zod.number().transform(num => num * 2);
        assert.ok(doubleSchema instanceof zod.ZodTransform, 'schema should be a ZodTransform');
        const doubleResult = doubleSchema.parse(3);
        assert.strictEqual(doubleResult, 6, 'transform should double the number');

        done();
    });
});
``` 
failed with the following error message:
```
schema should be a ZodTransform  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.