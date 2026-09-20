The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.overwrite', function(done) {
        // Prepare a simple transaction object
        const tx = { id: 123, amount: 1000, status: 'pending' };

        // Call the overwrite function – it should return an object (or the same object)
        let result;
        try {
            result = zod.z.overwrite(tx);
        } catch (err) {
            // If the function throws, the test should fail
            assert.fail('zod.z.overwrite threw an error: ' + err);
        }

        // Basic sanity checks
        assert.ok(result !== undefined, 'Result should be defined');
        // The function is expected to return an object; we check shallow equality
        assert.deepStrictEqual(result, tx, 'Result should equal the input transaction object');

        done();
    });
});
``` 
failed with the following error message:
```
Result should equal the input transaction object
+ actual - expected

+ $ZodCheckOverwrite {}
- {
-   amount: 1000,
-   id: 123,
-   status: 'pending'
- }
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.