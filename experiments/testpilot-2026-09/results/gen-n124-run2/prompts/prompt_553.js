The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.gt', function(done) {
        const value = 42;
        const extraParams = { foo: 'bar', baz: 123 };
        const result = zod.z.gt(value, extraParams);

        // The result should be an instance of the internal check class
        // (we don't import the class directly, so we just verify its shape)
        assert.strictEqual(result.check, 'greater_than', 'check type should be "greater_than"');
        assert.strictEqual(result.inclusive, false, 'inclusive flag should be false');
        assert.strictEqual(result.value, value, 'value should be the one passed in');

        // Extra parameters should be merged into the result object
        assert.strictEqual(result.foo, extraParams.foo, 'extra param "foo" should be preserved');
        assert.strictEqual(result.baz, extraParams.baz, 'extra param "baz" should be preserved');

        done();
    });
});
``` 
failed with the following error message:
```
check type should be "greater_than"
+ actual - expected

+ undefined
- 'greater_than'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.