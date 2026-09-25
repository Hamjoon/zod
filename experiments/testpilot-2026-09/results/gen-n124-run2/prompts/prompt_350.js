The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.intersection', function(done) {
        // Create two simple object schemas
        const left = zod.z.object({ name: zod.z.string() });
        const right = zod.z.object({ age: zod.z.number() });

        // Build the intersection schema
        const intersection = zod.z.intersection(left, right);

        // Verify the internal definition
        assert.strictEqual(intersection._def.type, "intersection");
        assert.strictEqual(intersection._def.left, left);
        assert.strictEqual(intersection._def.right, right);

        // A valid object should parse successfully
        const valid = { name: "Alice", age: 30 };
        const parsed = intersection.parse(valid);
        assert.deepStrictEqual(parsed, valid);

        // Missing a required key should throw
        assert.throws(() => intersection.parse({ name: "Bob" }), /Required/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Required/. Input:

'[\n' +
  '  {\n' +
  '    "expected": "number",\n' +
  '    "code": "invalid_type",\n' +
  '    "path": [\n' +
  '      "age"\n' +
  '    ],\n' +
  '    "message": "Invalid input: expected number, received undefined"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.