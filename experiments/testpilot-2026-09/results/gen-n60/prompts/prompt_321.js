The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.iso.duration', function(done) {
        // obtain the ISO‑8601 duration schema
        const schema = zod.z.iso.duration();

        // basic sanity: it should be a ZodString schema
        assert.strictEqual(schema._def.typeName, 'ZodString');

        // a valid ISO‑8601 duration should parse successfully
        const validDuration = 'P1Y2M3DT4H5M6S'; // 1 year, 2 months, 3 days, 4 hours, 5 minutes, 6 seconds
        assert.strictEqual(schema.parse(validDuration), validDuration);

        // an invalid string must throw a validation error
        assert.throws(() => schema.parse('not-a-duration'));

        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly equal:
+ actual - expected

+ undefined
- 'ZodString'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.