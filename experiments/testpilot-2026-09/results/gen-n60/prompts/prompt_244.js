The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.size', function(done) {
        const size = 42;
        const params = { foo: 'bar' };
        const result = zod.z.size(size, params);

        // The result should be an object with the expected properties
        assert.ok(result, 'Result should be truthy');
        assert.strictEqual(result.check, 'size_equals', 'check property should be "size_equals"');
        assert.strictEqual(result.size, size, 'size property should match the supplied size');
        assert.strictEqual(result.foo, params.foo, 'custom param should be preserved after normalization');

        done();
    });
});
``` 
failed with the following error message:
```
check property should be "size_equals"
+ actual - expected

+ undefined
- 'size_equals'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.