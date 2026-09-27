The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uuidv6', function(done) {
        // Generate a UUID v6
        const uuid = zod.z.uuidv6();

        // It should be a string
        assert.strictEqual(typeof uuid, 'string');

        // UUID v6 format:
        // 8-4-4-4-12 hex digits, version digit = 6, variant = 8/9/a/b
        const uuidV6Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-6[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        // Validate format
        assert.match(uuid, uuidV6Regex, 'Generated value is not a valid UUID v6');

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