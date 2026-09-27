The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nonoptional', function() {
        // Create a nonoptional schema wrapping a string schema
        const schema = zod.z.nonoptional(zod.z.string(), { description: 'non-optional string' });

        // Valid value should parse correctly
        assert.strictEqual(schema.parse('hello'), 'hello');

        // Undefined (or missing) value should be rejected
        assert.throws(() => schema.parse(undefined), /Required/);

        // The description param should be normalized onto the schema definition
        // Zod stores description in the internal _def object
        assert.strictEqual(schema._def.description, 'non-optional string');
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Required/. Input:

'[\n' +
  '  {\n' +
  '    "expected": "string",\n' +
  '    "code": "invalid_type",\n' +
  '    "path": [],\n' +
  '    "message": "Invalid input: expected string, received undefined"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.