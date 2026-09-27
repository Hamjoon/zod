The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.parse', function(done) {
        // 1. ISO datetime parsing (valid)
        const datetimeSchema = zod.iso.datetime();
        const dtResult = zod.z.parse(datetimeSchema, "2020-01-01T06:15Z");
        assert(dtResult instanceof Date, 'datetime should be parsed to a Date object');

        // 2. ISO datetime parsing (invalid) should throw ZodError
        assert.throws(() => {
            zod.z.parse(datetimeSchema, "not-a-date");
        }, /ZodError/, 'invalid datetime should throw ZodError');

        // 3. stringbool parsing
        const boolSchema = zod.stringbool();
        assert.strictEqual(zod.z.parse(boolSchema, "true"), true, '"true" => true');
        assert.strictEqual(zod.z.parse(boolSchema, "1"), true, '"1" => true');
        assert.strictEqual(zod.z.parse(boolSchema, "yes"), true, '"yes" => true');
        assert.strictEqual(zod.z.parse(boolSchema, "on"), true, '"on" => true');
        assert.strictEqual(zod.z.parse(boolSchema, "false"), false, '"false" => false');
        assert.strictEqual(zod.z.parse(boolSchema, "0"), false, '"0" => false');
        assert.strictEqual(zod.z.parse(boolSchema, "no"), false, '"no" => false');

        // 4. Object schema stripping extra keys
        const Dog = zod.object({ name: zod.string() });
        const dogResult = zod.z.parse(Dog, { name: "Yeller", extraKey: true });
        assert.deepStrictEqual(dogResult, { name: "Yeller" }, 'extra keys should be stripped');

        done();
    });
});
``` 
failed with the following error message:
```
datetime should be parsed to a Date object  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.