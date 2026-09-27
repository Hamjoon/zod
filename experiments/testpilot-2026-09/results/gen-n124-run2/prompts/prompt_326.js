The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.strictObject', function(done) {
        // Define a strict object schema with two required fields
        const schema = zod.z.strictObject({
            name: zod.z.string(),
            age: zod.z.number()
        });

        // 1️⃣ Valid object should parse without error
        const valid = { name: 'Alice', age: 30 };
        const parsed = schema.parse(valid);
        assert.deepStrictEqual(parsed, valid);

        // 2️⃣ Object containing an unknown key should throw
        assert.throws(() => {
            schema.parse({ name: 'Bob', age: 25, extra: true });
        }, /Unrecognized key|unknown key|unexpected key/i);

        // 3️⃣ Object missing a required key should also throw
        assert.throws(() => {
            schema.parse({ name: 'Bob' });
        }, /Required|missing/i);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Required|missing/i. Input:

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