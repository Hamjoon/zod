The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.negative', function(done) {
        // Create a schema that only accepts negative numbers
        const schema = zod.z.negative();

        // Positive test: a negative number should pass validation
        assert.strictEqual(schema.parse(-42), -42);

        // Negative tests: zero and positive numbers should fail validation
        assert.throws(() => schema.parse(0), /Invalid/);
        assert.throws(() => schema.parse(7), /Invalid/);

        done();
    });
});
``` 
failed with the following error message:
```
schema.parse is not a function  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.