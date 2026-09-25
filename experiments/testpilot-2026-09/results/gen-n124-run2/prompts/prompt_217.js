The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.float64', function(done) {
        // Call the function without parameters to get the default schema
        const schema = zod.z.float64();

        // Verify the basic shape of the returned schema
        assert.strictEqual(schema.type, 'number', 'type should be "number"');

        // The schema should define exclusive bounds for a 64‑bit float
        assert.ok('exclusiveMinimum' in schema, 'exclusiveMinimum should be present');
        assert.ok('exclusiveMaximum' in schema, 'exclusiveMaximum should be present');

        // Expected IEEE‑754 double‑precision limits
        const expectedMin = -1.7976931348623157e308;
        const expectedMax =  1.7976931348623157e308;

        // Verify the bounds match the expected limits
        assert.strictEqual(schema.exclusiveMinimum, expectedMin, 'exclusiveMinimum should match IEEE‑754 double min');
        assert.strictEqual(schema.exclusiveMaximum, expectedMax, 'exclusiveMaximum should match IEEE‑754 double max');

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