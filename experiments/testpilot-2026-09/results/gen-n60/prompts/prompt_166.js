The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.prefault', function(done) {
        // Use a simple inner type – any works for the purpose of this test
        const inner = zod.z.any();

        // 1. defaultValue supplied as a plain value
        const literalDefault = 12345;
        const prefaultLiteral = zod.z.prefault(inner, literalDefault);

        // Verify the shape of the returned object
        assert.strictEqual(prefaultLiteral.type, 'prefault', 'type should be "prefault"');
        assert.strictEqual(prefaultLiteral.innerType, inner, 'innerType should be preserved');
        // The getter should return the literal value
        assert.strictEqual(prefaultLiteral.defaultValue, literalDefault, 'defaultValue getter should return the literal value');

        // 2. defaultValue supplied as a function
        let callCount = 0;
        const fn = () => {
            callCount++;
            return 'computed';
        };
        const prefaultFn = zod.z.prefault(inner, fn);

        // The function should not be called until the getter is accessed
        assert.strictEqual(callCount, 0, 'function should not be called before getter access');

        // First access – should invoke the function once
        assert.strictEqual(prefaultFn.defaultValue, 'computed', 'getter should return the function result');
        assert.strictEqual(callCount, 1, 'function should have been called exactly once');

        // Second access – getter invokes the function again (it's a getter, not a cached value)
        assert.strictEqual(prefaultFn.defaultValue, 'computed', 'getter should still return the function result');
        assert.strictEqual(callCount, 2, 'function should have been called a second time');

        done();
    });
});
``` 
failed with the following error message:
```
type should be "prefault"
+ actual - expected

+ undefined
- 'prefault'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.