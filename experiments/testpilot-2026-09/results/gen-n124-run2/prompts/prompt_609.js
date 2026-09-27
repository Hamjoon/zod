The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.maxSize', function(done) {
        // create a string schema and apply a maxSize check of 5 characters
        const schema = zod.z.string();
        schema.check(zod.z.maxSize(5));

        // A value whose length is exactly the limit should pass
        assert.doesNotThrow(() => {
            // most Zod‑like APIs expose a `parse` (or `validate`) method that throws on failure
            // using `parse` here works for both the official Zod and the mini version referenced
            schema.parse('hello');
        }, 'Value with length 5 should not throw');

        // A value that exceeds the limit should throw an error
        assert.throws(() => {
            schema.parse('hello!'); // length 6 > 5
        }, /maxSize/, 'Value exceeding maxSize should throw');

        done();
    });
});
``` 
failed with the following error message:
```
Missing expected exception: Value exceeding maxSize should throw  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.