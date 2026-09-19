The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nonpositive', function(done) {
        // Create a schema that only accepts non‑positive numbers
        const schema = zod.z.nonpositive();

        // Values that should pass validation
        const valid = [0, -1, -42.5];
        valid.forEach(val => {
            assert.doesNotThrow(() => schema.parse(val), `Expected ${val} to be accepted`);
        });

        // Values that should fail validation
        const invalid = [1, 0.1, 'string', null, undefined, {}];
        invalid.forEach(val => {
            assert.throws(() => schema.parse(val), `Expected ${val} to be rejected`);
        });

        done();
    });
});
``` 
failed with the following error message:
```
Got unwanted exception: Expected 0 to be accepted
Actual message: "schema.parse is not a function"  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.