The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.minLength', function(done) {
        // Create a string schema with a minimum length of 5
        const schema = zod.string().check(zod.minLength(5));

        // Value that meets the minimum length should pass without throwing
        assert.doesNotThrow(() => {
            schema.parse('hello'); // exactly 5 characters
        }, 'Expected parse to succeed for a string of length 5');

        // Value longer than the minimum should also pass
        assert.doesNotThrow(() => {
            schema.parse('helloworld'); // longer than 5 characters
        }, 'Expected parse to succeed for a string longer than 5 characters');

        // Value shorter than the minimum should throw an error
        assert.throws(() => {
            schema.parse('hi'); // only 2 characters
        }, /minimum length/, 'Expected parse to fail for a string shorter than 5 characters');

        done();
    });
});
``` 
failed with the following error message:
```
Expected parse to fail for a string shorter than 5 characters  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.