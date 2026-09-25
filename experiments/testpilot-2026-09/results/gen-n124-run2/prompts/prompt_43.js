The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.coerce.boolean', function(done) {
        const schema = zod.z.coerce.boolean();

        // Valid coercions
        assert.strictEqual(schema.parse(true), true);
        assert.strictEqual(schema.parse(false), false);
        assert.strictEqual(schema.parse('true'), true);
        assert.strictEqual(schema.parse('false'), false);
        assert.strictEqual(schema.parse(1), true);
        assert.strictEqual(schema.parse(0), false);

        // Invalid value should throw
        assert.throws(() => schema.parse('yes'));

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