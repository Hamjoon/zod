The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.strictObject', function(done) {
        // Define a strict object schema with two required fields
        const schema = zod.z.strictObject({
            name: zod.z.string(),
            age: zod.z.number()
        });

        // ---- Positive case: object matches the schema exactly ----
        const validObj = { name: 'Alice', age: 28 };
        // parse should return the same object without throwing
        assert.deepStrictEqual(schema.parse(validObj), validObj);

        // ---- Negative case 1: extra unexpected key ----
        const objWithExtra = { name: 'Bob', age: 35, extra: true };
        assert.throws(() => {
            schema.parse(objWithExtra);
        }, /unrecognized key|unknown key|extra/i, 'Expected an error for extra keys');

        // ---- Negative case 2: missing required key ----
        const objMissingKey = { name: 'Charlie' };
        assert.throws(() => {
            schema.parse(objMissingKey);
        }, /required|missing/i, 'Expected an error for missing required keys');

        done();
    });
});
``` 
failed with the following error message:
```
Expected an error for missing required keys  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.