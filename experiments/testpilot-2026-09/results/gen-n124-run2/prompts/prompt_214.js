The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.float64', function(done) {
        // Call the function without parameters to get the default float64 schema
        const schema = zod.z.float64();

        // Verify that the returned object has the expected shape
        assert.strictEqual(typeof schema, 'object', 'schema should be an object');
        assert.strictEqual(schema.type, 'number', 'type should be "number"');

        // The exclusive bounds for a 64‑bit float should match Number.MAX_VALUE
        const expectedMin = -Number.MAX_VALUE;
        const expectedMax = Number.MAX_VALUE;

        assert.strictEqual(schema.exclusiveMinimum, expectedMin, 'exclusiveMinimum should be -Number.MAX_VALUE');
        assert.strictEqual(schema.exclusiveMaximum, expectedMax, 'exclusiveMaximum should be Number.MAX_VALUE');

        // Ensure no unexpected keys are present
        const keys = Object.keys(schema).sort();
        assert.deepStrictEqual(keys, ['exclusiveMaximum', 'exclusiveMinimum', 'type'].sort(),
            'schema should only contain type, exclusiveMinimum and exclusiveMaximum');

        done();
    });
});
``` 
failed with the following error message:
```
type should be "number"
+ actual - expected

+ undefined
- 'number'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.