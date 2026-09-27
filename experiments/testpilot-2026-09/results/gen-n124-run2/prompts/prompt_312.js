The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.keyof', function(done) {
        // Define an object schema
        const userSchema = zod.z.object({
            name: zod.z.string(),
            age: zod.z.number()
        });

        // Use zod.z.keyof to get an enum of the object's keys
        const keysEnum = zod.z.keyof(userSchema);

        // The result should be a ZodEnum instance
        assert(keysEnum instanceof zod.z.ZodEnum, 'keyof should return a ZodEnum');

        // Valid keys should parse successfully
        assert.strictEqual(keysEnum.parse('name'), 'name');
        assert.strictEqual(keysEnum.parse('age'), 'age');

        // Invalid keys should throw a validation error
        assert.throws(() => keysEnum.parse('email'), /Invalid enum value/);

        done();
    });
});
``` 
failed with the following error message:
```
keyof should return a ZodEnum  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.