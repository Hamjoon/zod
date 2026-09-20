The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.coerce.boolean', function(done) {
        // Create a coerced boolean schema
        const schema = zod.z.coerce.boolean();

        // Direct booleans should pass through unchanged
        assert.strictEqual(schema.parse(true), true);
        assert.strictEqual(schema.parse(false), false);

        // String representations
        assert.strictEqual(schema.parse('true'), true);
        assert.strictEqual(schema.parse('false'), false);
        assert.strictEqual(schema.parse(''), false); // empty string -> false

        // Numeric representations
        assert.strictEqual(schema.parse(1), true);
        assert.strictEqual(schema.parse(0), false);

        // Undefined and null should coerce to false
        assert.strictEqual(schema.parse(undefined), false);
        assert.strictEqual(schema.parse(null), false);

        // Values that cannot be coerced should throw a ZodError
        assert.throws(() => schema.parse('yes'), /ZodError/);
        assert.throws(() => schema.parse({}), /ZodError/);
        assert.throws(() => schema.parse([]), /ZodError/);

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