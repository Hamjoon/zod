The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.gt', function(done) {
        // basic usage: number greater than 5
        const schema = zod.number().gt(5);
        // value greater than 5 should pass
        assert.doesNotThrow(() => schema.parse(6));
        // value equal to 5 should fail with the default message
        assert.throws(() => schema.parse(5), /Number must be greater than 5/);
        // value less than 5 should also fail
        assert.throws(() => schema.parse(4), /Number must be greater than 5/);

        // custom error message via params
        const customSchema = zod.number().gt(10, { message: "Too small" });
        try {
            customSchema.parse(9);
        } catch (e) {
            // Zod throws a ZodError; its first issue should contain our custom message
            assert.strictEqual(e.errors[0].message, "Too small");
        }

        // bigint usage
        const bigSchema = zod.bigint().gt(5n);
        assert.doesNotThrow(() => bigSchema.parse(6n));
        assert.throws(() => bigSchema.parse(5n), /BigInt must be greater than 5/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Number must be greater than 5/. Input:

'[\n' +
  '  {\n' +
  '    "origin": "number",\n' +
  '    "code": "too_small",\n' +
  '    "minimum": 5,\n' +
  '    "inclusive": false,\n' +
  '    "path": [],\n' +
  '    "message": "Too small: expected number to be >5"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.