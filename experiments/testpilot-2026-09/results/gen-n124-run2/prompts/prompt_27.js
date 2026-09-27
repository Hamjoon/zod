The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.coerce.string', function(done) {
        // Create a coercing string schema
        const schema = zod.z.coerce.string();

        // Values that should be coerced to strings
        assert.strictEqual(schema.parse(123), '123', 'Number should be coerced to string');
        assert.strictEqual(schema.parse(true), 'true', 'Boolean should be coerced to string');
        assert.strictEqual(schema.parse(undefined), 'undefined', 'Undefined should be coerced to string');

        // Values that should NOT be coerced and should throw
        assert.throws(() => schema.parse({}), /Expected string/, 'Object should cause a validation error');
        assert.throws(() => schema.parse([]), /Expected string/, 'Array should cause a validation error');

        done();
    });
});
``` 
failed with the following error message:
```
Missing expected exception: Object should cause a validation error  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.