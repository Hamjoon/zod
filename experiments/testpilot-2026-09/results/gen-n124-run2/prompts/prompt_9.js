The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.iso.date', function(done) {
        // Create a schema using the iso.date helper
        const isoDateSchema = zod.z.iso.date();

        // Valid ISO date strings should pass
        const valid1 = isoDateSchema.safeParse('2023-01-10T00:00:00.000Z');
        const valid2 = isoDateSchema.safeParse('2023-01-10');
        const valid3 = isoDateSchema.safeParse('2023-01-10T12:34:56Z');

        assert.strictEqual(valid1.success, true, 'Full ISO datetime should be valid');
        assert.strictEqual(valid2.success, true, 'Date‑only ISO string should be valid');
        assert.strictEqual(valid3.success, true, 'ISO datetime without milliseconds should be valid');

        // Invalid date strings should fail
        const invalid1 = isoDateSchema.safeParse('2023-13-10'); // month out of range
        const invalid2 = isoDateSchema.safeParse('0000-00-00'); // impossible date
        const invalid3 = isoDateSchema.safeParse('not-a-date'); // not a date at all

        assert.strictEqual(invalid1.success, false, 'Month 13 should be invalid');
        assert.strictEqual(invalid2.success, false, 'Zero month/day should be invalid');
        assert.strictEqual(invalid3.success, false, 'Non‑date string should be invalid');

        done();
    });
});
``` 
failed with the following error message:
```
Full ISO datetime should be valid

false !== true
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.