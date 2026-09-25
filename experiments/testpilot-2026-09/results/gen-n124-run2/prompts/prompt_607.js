The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.maxSize', function(done) {
        // Create a string schema with a maximum size of 5 characters
        const schema = zod.z.string().maxSize(5);

        // Should succeed for strings of length <= 5
        assert.doesNotThrow(() => schema.parse('hello'));

        // Should fail for strings longer than 5 characters
        assert.throws(() => schema.parse('hello!'), zod.ZodError);

        done();
    });
});
``` 
failed with the following error message:
```
zod.z.string(...).maxSize is not a function  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.