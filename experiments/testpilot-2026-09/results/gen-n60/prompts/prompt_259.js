The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.property', function(done) {
        // Create a schema that validates an object with a required string property "name"
        const nameSchema = zod.z.property('name', zod.z.string(), { required: true });

        // A valid object should pass without throwing
        assert.doesNotThrow(() => nameSchema.parse({ name: 'Alice' }));

        // Missing the required property should throw a ZodError
        assert.throws(() => nameSchema.parse({}), /required/);

        // Providing a wrong type for the property should also throw a ZodError
        assert.throws(() => nameSchema.parse({ name: 123 }), /Expected string/);

        done();
    });
});
``` 
failed with the following error message:
```
Got unwanted exception.
Actual message: "nameSchema.parse is not a function"  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.