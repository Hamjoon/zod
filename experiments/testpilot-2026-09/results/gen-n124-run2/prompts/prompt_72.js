The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.string', function(done) {
        // Create a string schema with a minimum length of 2 and a maximum of 5
        const schema = zod.z.string()
            .min(2, { error: "Too short" })
            .max(5, { error: "Too long" });

        // Valid cases
        assert.strictEqual(schema.parse('ab'), 'ab');   // exactly min length
        assert.strictEqual(schema.parse('abcde'), 'abcde'); // exactly max length
        assert.strictEqual(schema.parse('abcd'), 'abcd'); // between min and max

        // Invalid cases – too short
        assert.throws(() => {
            schema.parse('a');
        }, /Too short/);

        // Invalid cases – too long
        assert.throws(() => {
            schema.parse('abcdef');
        }, /Too long/);

        // Invalid type – not a string
        assert.throws(() => {
            schema.parse(123);
        }, /Expected string, received number/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Expected string, received number/. Input:

'[\n' +
  '  {\n' +
  '    "expected": "string",\n' +
  '    "code": "invalid_type",\n' +
  '    "path": [],\n' +
  '    "message": "Invalid input: expected string, received number"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.