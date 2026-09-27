The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uuid', function(done) {
        const schema = zod.z.uuid();
        // Verify that the returned schema is an object
        assert.ok(schema && typeof schema === 'object');
        // Verify the expected JSON‑Schema properties
        assert.strictEqual(schema.type, 'string');
        assert.strictEqual(schema.format, 'uuid');
        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly equal:
+ actual - expected

+ undefined
- 'string'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.