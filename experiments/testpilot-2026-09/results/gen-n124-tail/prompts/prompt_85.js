The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.getErrorMap', function(done) {
        // Retrieve the current error map
        const errorMap = zod.z.getErrorMap();
        // It should be a function
        assert.strictEqual(typeof errorMap, 'function');

        // Call the error map with a known error code to verify default behavior
        const result = errorMap(
            {
                code: 'invalid_type',
                path: [],
                expected: 'string',
                received: 123,
            },
            { defaultError: 'Default error' }
        );

        // The result should be an object containing a string `message`
        assert.ok(result && typeof result.message === 'string');

        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly equal:
+ actual - expected

+ 'undefined'
- 'function'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.