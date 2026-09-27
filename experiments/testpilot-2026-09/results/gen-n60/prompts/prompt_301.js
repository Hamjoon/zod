The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.overwrite', function(done) {
        const tx = { foo: 'bar' };
        const result = zod.z.overwrite(tx);
        // The returned object should carry the correct check type
        assert.strictEqual(result.check, 'overwrite');
        // The transaction object should be preserved
        assert.strictEqual(result.tx, tx);
        // It should be an instance of the internal ZodCheckOverwrite class
        // (checking the constructor name is a safe way without importing internal modules)
        assert.ok(
            result.constructor && 
            typeof result.constructor.name === 'string' && 
            result.constructor.name.includes('ZodCheckOverwrite')
        );
        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly equal:
+ actual - expected

+ undefined
- 'overwrite'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.