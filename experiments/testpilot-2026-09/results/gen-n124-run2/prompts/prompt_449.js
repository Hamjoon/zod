The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nonoptional', function(done) {
        // Create a nonoptional string schema
        const schema = zod.z.nonoptional(zod.z.string());

        // Should accept a valid string
        assert.doesNotThrow(() => {
            const result = schema.parse('hello world');
            assert.strictEqual(result, 'hello world');
        });

        // Should reject undefined (value is required)
        assert.throws(() => {
            schema.parse(undefined);
        }, /Required/);

        // Should reject null (null is not considered a valid value for nonoptional)
        assert.throws(() => {
            schema.parse(null);
        }, /Required/);

        done();
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