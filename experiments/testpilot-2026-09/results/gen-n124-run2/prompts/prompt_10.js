The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.iso.date', function(done) {
        // ---- Valid ISO date string ----
        const isoString = "2023-01-01T12:34:56.789Z";
        // The function is expected to return a Date instance when given a valid ISO string
        const result = zod.z.iso.date(isoString);
        assert.ok(result instanceof Date, 'Result should be a Date object');
        assert.strictEqual(result.toISOString(), isoString, 'Date should match the original ISO string');

        // ---- Invalid ISO date string ----
        const badString = "not-a-valid-date";
        // The function should throw an error for an invalid ISO date string
        assert.throws(() => {
            zod.z.iso.date(badString);
        }, /invalid|date/i, 'Should throw on invalid ISO date string');

        done();
    });
});
``` 
failed with the following error message:
```
Result should be a Date object  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.