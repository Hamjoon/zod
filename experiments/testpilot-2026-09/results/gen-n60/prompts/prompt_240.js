The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.gte', function(done) {
        // Create a schema that validates numbers greater than or equal to 5
        const schema = zod.z.gte(5);

        // Values that should pass validation
        try {
            schema.parse(5);   // exactly the boundary
            schema.parse(10);  // above the boundary
        } catch (e) {
            return done(new Error('Valid values threw an error: ' + e.message));
        }

        // Values that should fail validation
        const shouldFail = [4, -1, 0, 3.999];
        for (const val of shouldFail) {
            try {
                schema.parse(val);
                return done(new Error(`Invalid value ${val} did not throw an error`));
            } catch (e) {
                // Expected to throw – optionally check the error message contains "gte"
                if (!/gte/.test(e.message)) {
                    // If the error message does not mention "gte", still consider it a pass
                    // because the exact wording may differ across versions.
                }
            }
        }

        // If we reach here, all assertions passed
        done();
    });
});
``` 
failed with the following error message:
```
Valid values threw an error: schema.parse is not a function  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.