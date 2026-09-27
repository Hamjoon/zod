The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uuidv6', function(done) {
        // Generate a UUID v6 using the library
        const uuid = zod.z.uuidv6();

        // Verify that the result is a string
        assert.strictEqual(typeof uuid, 'string');

        // UUID v6 format:
        // - 8-4-4-4-12 hex digits
        // - version nibble (13th hex digit) must be '6'
        // - variant nibble (first of the 4th group) must be one of 8,9,a,b
        const uuidV6Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-6[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        // Assert that the generated UUID matches the v6 pattern
        assert.ok(uuidV6Regex.test(uuid), `Generated UUID does not match v6 format: ${uuid}`);

        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly equal:

'object' !== 'string'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.