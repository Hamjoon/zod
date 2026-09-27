The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.keyof', function(done) {
        // Create an object schema with known keys
        const objSchema = zod.object({
            name: zod.string(),
            age: zod.number(),
        });

        // Use the custom keyof helper
        const keySchema = zod.z.keyof(objSchema);

        // The resulting schema should be a Zod literal that matches the array of keys
        // Verify that parsing the exact key array succeeds
        const expectedKeys = ['name', 'age'];
        const parsed = keySchema.parse(expectedKeys);
        assert.deepStrictEqual(parsed, expectedKeys);

        // Verify that parsing any other value throws a validation error
        assert.throws(() => keySchema.parse(['name']));
        assert.throws(() => keySchema.parse(['age', 'name'])); // order matters for literal

        done();
    });
});
``` 
failed with the following error message:
```
[
  {
    "code": "invalid_value",
    "values": [
      "name",
      "age"
    ],
    "path": [],
    "message": "Invalid option: expected one of \"name\"|\"age\""
  }
]  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.