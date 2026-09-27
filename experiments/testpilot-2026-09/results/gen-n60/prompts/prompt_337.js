The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.coerce.number', function(done) {
        // Create a coerced number schema
        const schema = zod.coerce.number();

        // Valid coercions
        assert.strictEqual(schema.parse("42"), 42);
        assert.strictEqual(schema.parse(3.14), 3.14);
        assert.strictEqual(schema.parse("0"), 0);

        // safeParse should succeed for a numeric string
        const safeResult = schema.safeParse("100");
        assert.strictEqual(safeResult.success, true);
        assert.strictEqual(safeResult.data, 100);

        // Invalid coercion should throw
        assert.throws(() => schema.parse("not-a-number"), /Expected number/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Expected number/. Input:

'[\n' +
  '  {\n' +
  '    "expected": "number",\n' +
  '    "code": "invalid_type",\n' +
  '    "received": "NaN",\n' +
  '    "path": [],\n' +
  '    "message": "Invalid input: expected number, received NaN"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.