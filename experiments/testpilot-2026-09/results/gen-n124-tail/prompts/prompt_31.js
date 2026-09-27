The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.overwrite', function(done) {
        // 1️⃣ Verify that the overwrite callback is executed and its result is used
        let called = false;
        const overwriteFn = (val) => {
            called = true;
            return val + 'b';
        };
        const stringSchema = zod.z.string().overwrite(overwriteFn);
        const overwritten = stringSchema.parse('a');
        assert.strictEqual(called, true, 'overwrite callback should have been called');
        assert.strictEqual(overwritten, 'ab', 'value should be transformed by overwrite');

        // 2️⃣ Verify that subsequent checks run on the overwritten value
        const numberSchema = zod.z.number()
            .overwrite((n) => n * 2)   // double the input first
            .max(5);                    // then enforce max ≤ 5

        // Input 2 → overwritten to 4, which satisfies max(5)
        assert.strictEqual(numberSchema.parse(2), 4, '2 should be doubled to 4 and pass max(5)');

        // Input 3 → overwritten to 6, which violates max(5)
        assert.throws(
            () => numberSchema.parse(3),
            /Number must be less than or equal to 5/,
            '3 should be doubled to 6 and fail max(5)'
        );

        done();
    });
});
``` 
failed with the following error message:
```
3 should be doubled to 6 and fail max(5)  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.