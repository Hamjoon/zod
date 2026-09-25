The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.endsWith', function(done) {
        // Basic usage – should accept strings that end with the suffix
        const endsWithWorld = zod.z.string().endsWith('world');
        assert.doesNotThrow(() => endsWithWorld.parse('hello world'));

        // Should reject strings that do not end with the suffix
        assert.throws(() => endsWithWorld.parse('hello'), /Invalid input/);

        // Custom error message via params
        const customMsgSchema = zod.z.string().endsWith('test', { message: 'must end with test' });
        try {
            customMsgSchema.parse('foobar');
            // If no error is thrown, the test should fail
            assert.fail('Expected validation to throw');
        } catch (e) {
            // Zod errors are stored in e.errors array
            assert(Array.isArray(e.errors), 'Error should contain an errors array');
            assert.strictEqual(e.errors[0].message, 'must end with test');
        }

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Invalid input/. Input:

'[\n' +
  '  {\n' +
  '    "origin": "string",\n' +
  '    "code": "invalid_format",\n' +
  '    "format": "ends_with",\n' +
  '    "suffix": "world",\n' +
  '    "path": [],\n' +
  '    "message": "Invalid string: must end with \\"world\\""\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.