The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.getErrorMap', function(done) {
        // Create a custom error map function
        const customErrorMap = (issue, ctx) => ({
            message: `Custom error for ${issue.code}`
        });

        // Register the custom error map with Zod
        zod.setErrorMap(customErrorMap);

        // Retrieve the error map via the function under test
        const retrievedMap = zod.z.getErrorMap();

        // Verify that the retrieved map is exactly the one we set
        assert.strictEqual(retrievedMap, customErrorMap, 'The retrieved error map should match the custom map set earlier');

        // Clean up: reset to default error map to avoid side effects for other tests
        zod.setErrorMap(zod.z.getDefaultErrorMap());

        done();
    });
});
``` 
failed with the following error message:
```
zod.z.getDefaultErrorMap is not a function  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.