The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uuid', function(done) {
        // Create the UUID schema
        const schema = zod.z.uuid();

        // A known valid UUID (RFC 4122 version 4 format)
        const validUuid = '123e4567-e89b-12d3-a456-426614174000';

        // The schema should accept a valid UUID without throwing
        try {
            const parsed = schema.parse(validUuid);
            assert.strictEqual(parsed, validUuid);
        } catch (err) {
            return done(err);
        }

        // An invalid UUID should cause a validation error
        const invalidUuid = 'not-a-valid-uuid';
        assert.throws(() => schema.parse(invalidUuid), /Invalid uuid/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Invalid uuid/. Input:

'[\n' +
  '  {\n' +
  '    "origin": "string",\n' +
  '    "code": "invalid_format",\n' +
  '    "format": "uuid",\n' +
  '    "pattern": "/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$/",\n' +
  '    "path": [],\n' +
  '    "message": "Invalid UUID"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.