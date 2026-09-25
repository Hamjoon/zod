The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.coerce.string', function(done) {
        // Create a coercing string schema
        const schema = zod.z.coerce.string();

        // Should coerce numbers to strings
        const numResult = schema.safeParse(12345);
        assert.strictEqual(numResult.success, true);
        assert.strictEqual(numResult.data, "12345");

        // Should coerce booleans to strings
        const boolResult = schema.safeParse(true);
        assert.strictEqual(boolResult.success, true);
        assert.strictEqual(boolResult.data, "true");

        // Should coerce null to "null"
        const nullResult = schema.safeParse(null);
        assert.strictEqual(nullResult.success, true);
        assert.strictEqual(nullResult.data, "null");

        // Should fail for objects that cannot be sensibly stringified
        const objResult = schema.safeParse({ key: "value" });
        assert.strictEqual(objResult.success, false);

        // Should accept already‑string values unchanged
        const strResult = schema.safeParse("already a string");
        assert.strictEqual(strResult.success, true);
        assert.strictEqual(strResult.data, "already a string");

        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly equal:

true !== false
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.