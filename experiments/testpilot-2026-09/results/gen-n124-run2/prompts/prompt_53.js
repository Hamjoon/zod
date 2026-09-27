The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.coerce.date', function(done) {
        // Create the coerced date schema
        const schema = zod.z.coerce.date();

        // It should be a ZodDate instance
        assert(schema instanceof zod.ZodDate, 'Schema should be an instance of ZodDate');

        // Valid string input should be coerced to a Date
        const dateFromString = schema.parse('2021-03-15');
        assert(dateFromString instanceof Date, 'Result should be a Date object');
        assert.strictEqual(dateFromString.toISOString().slice(0, 10), '2021-03-15');

        // Valid numeric timestamp should be coerced to a Date
        const timestamp = 1625097600000; // 2021-07-01T00:00:00.000Z
        const dateFromNumber = schema.parse(timestamp);
        assert(dateFromNumber instanceof Date, 'Result should be a Date object');
        assert.strictEqual(dateFromNumber.getTime(), timestamp);

        // Invalid input should throw a ZodError
        assert.throws(() => {
            schema.parse('not-a-date');
        }, /Invalid date/);

        // Empty input (undefined) should also throw
        assert.throws(() => {
            schema.parse(undefined);
        }, /Required/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Invalid date/. Input:

'[\n' +
  '  {\n' +
  '    "expected": "date",\n' +
  '    "code": "invalid_type",\n' +
  '    "received": "Invalid Date",\n' +
  '    "path": [],\n' +
  '    "message": "Invalid input: expected date, received Date"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.