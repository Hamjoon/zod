The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.number', function(done) {
        // basic number validation
        const numSchema = zod.z.number();
        assert.strictEqual(numSchema.parse(42), 42);
        assert.throws(() => numSchema.parse('42'), /Expected number/);
        assert.throws(() => numSchema.parse(Infinity), /Expected number/);
        assert.throws(() => numSchema.parse(NaN), /Expected number/);

        // integer validation
        const intSchema = zod.z.number().int();
        assert.strictEqual(intSchema.parse(7), 7);
        assert.throws(() => intSchema.parse(7.3), /Expected integer/);

        // max constraint combined with int
        const limitedInt = zod.z.number().int().max(10);
        assert.strictEqual(limitedInt.parse(10), 10);
        assert.throws(() => limitedInt.parse(11), /Number must be less than or equal to 10/);

        // overwrite (transform) test
        const doubled = zod.z.number().overwrite(val => val * 2);
        assert.strictEqual(doubled.parse(5), 10);
        // ensure transformation still respects other constraints
        const transformedMax = zod.z.number().overwrite(v => v + 1).max(5);
        assert.strictEqual(transformedMax.parse(4), 5);
        assert.throws(() => transformedMax.parse(5), /Number must be less than or equal to 5/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Expected number/. Input:

'[\n' +
  '  {\n' +
  '    "expected": "number",\n' +
  '    "code": "invalid_type",\n' +
  '    "path": [],\n' +
  '    "message": "Invalid input: expected number, received string"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.