The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.date', function(done) {
        // Create a basic date schema
        const schema = zod.z.date();

        // Parsing a valid Date should succeed and return the same instance
        const now = new Date();
        const parsed = schema.parse(now);
        assert.strictEqual(parsed, now, 'Parsed date should be the same instance');

        // Parsing an invalid type should throw a ZodError
        assert.throws(() => {
            schema.parse('2020-01-01');
        }, /Invalid date/, 'String should not be accepted as a date');

        // Create a date schema with custom error messages via params
        const schemaWithMessage = zod.z.date({ required_error: "Date required", invalid_type_error: "Not a date" });

        // Missing value should trigger the required_error
        assert.throws(() => {
            schemaWithMessage.parse(undefined);
        }, /Date required/, 'Missing value should produce the custom required_error');

        // Invalid type should trigger the invalid_type_error
        assert.throws(() => {
            schemaWithMessage.parse(123);
        }, /Not a date/, 'Invalid type should produce the custom invalid_type_error');

        done();
    });
});
``` 
failed with the following error message:
```
String should not be accepted as a date  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.