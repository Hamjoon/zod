The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.prefault', function(done) {
        // static default value
        const inner = zod.string();
        const staticDefault = 'default';
        const prefaultStatic = zod.z.prefault(inner, staticDefault);
        assert(prefaultStatic instanceof zod.ZodPrefault, 'Should be instance of ZodPrefault');
        assert.strictEqual(prefaultStatic.type, 'prefault');
        assert.strictEqual(prefaultStatic.innerType, inner);
        assert.strictEqual(prefaultStatic.defaultValue, staticDefault);

        // default value supplied as a function
        const fnDefault = () => 123;
        const prefaultFn = zod.z.prefault(inner, fnDefault);
        assert.strictEqual(prefaultFn.defaultValue, 123);

        // ensure the getter calls the function each time (lazy evaluation)
        let callCount = 0;
        const counterFn = () => ++callCount;
        const prefaultCounter = zod.z.prefault(inner, counterFn);
        assert.strictEqual(prefaultCounter.defaultValue, 1);
        assert.strictEqual(prefaultCounter.defaultValue, 2);
        assert.strictEqual(callCount, 2);

        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly equal:
+ actual - expected

+ undefined
- 'prefault'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.