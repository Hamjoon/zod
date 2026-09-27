The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.lte', function(done) {
        // Basic usage with a value and extra params
        const value = 42;
        const extraParams = { custom: 'data' };
        const result = zod.z.lte(value, extraParams);

        // The result should be an object with the expected shape
        assert.strictEqual(result.check, 'less_than', 'check type should be "less_than"');
        assert.strictEqual(result.inclusive, true, 'inclusive flag should be true');
        assert.strictEqual(result.value, value, 'value should be preserved');
        assert.strictEqual(result.custom, extraParams.custom, 'extra params should be merged');

        // When called without extra params, it should still produce a valid check object
        const resultNoParams = zod.z.lte(value);
        assert.strictEqual(resultNoParams.check, 'less_than');
        assert.strictEqual(resultNoParams.inclusive, true);
        assert.strictEqual(resultNoParams.value, value);
        // No extra fields should be present
        assert.deepStrictEqual(Object.keys(resultNoParams).sort(), ['check', 'inclusive', 'value'].sort());

        done();
    });
});
``` 
failed with the following error message:
```
check type should be "less_than"
+ actual - expected

+ undefined
- 'less_than'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.