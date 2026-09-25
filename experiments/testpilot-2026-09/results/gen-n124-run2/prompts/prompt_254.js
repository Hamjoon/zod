The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uint64', function(done) {
        // default schema – should accept the full uint64 range
        const defaultSchema = zod.z.uint64();

        // valid values
        assert.doesNotThrow(() => defaultSchema.parse(0n));
        assert.doesNotThrow(() => defaultSchema.parse(18446744073709551615n));

        // out‑of‑range values
        assert.throws(() => defaultSchema.parse(-1n), /expected/);
        assert.throws(() => defaultSchema.parse(18446744073709551616n), /expected/);

        // schema with a custom minimum
        const minSchema = zod.z.uint64({ min: 10n });
        assert.doesNotThrow(() => minSchema.parse(10n));
        assert.throws(() => minSchema.parse(9n), /expected/);

        // schema with a custom maximum
        const maxSchema = zod.z.uint64({ max: 100n });
        assert.doesNotThrow(() => maxSchema.parse(100n));
        assert.throws(() => maxSchema.parse(101n), /expected/);

        done();
    });
});
``` 
failed with the following error message:
```
Missing expected exception.  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.