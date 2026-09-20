The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.uppercase', function(done) {
        // 1️⃣  Call without any parameters – should return a check object with the default fields
        const result = zod.z.uppercase();
        assert.ok(result, 'Result should be truthy');
        assert.strictEqual(result.check, 'string_format', 'check field should be "string_format"');
        assert.strictEqual(result.format, 'uppercase', 'format field should be "uppercase"');

        // 2️⃣  Call with a custom parameter – the custom fields should be merged into the result
        const customParams = { customKey: 'customValue' };
        const resultWithCustom = zod.z.uppercase(customParams);
        assert.ok(resultWithCustom, 'Result with custom params should be truthy');
        assert.strictEqual(resultWithCustom.check, 'string_format', 'check field should still be "string_format"');
        assert.strictEqual(resultWithCustom.format, 'uppercase', 'format field should still be "uppercase"');
        assert.strictEqual(resultWithCustom.customKey, 'customValue', 'Custom parameter should be merged');

        // 3️⃣  Verify that the returned object is an instance of the expected Zod check class
        //    (We fall back to checking the constructor name because the class may not be exported directly)
        const constructorName = resultWithCustom.constructor && resultWithCustom.constructor.name;
        assert.ok(
            typeof constructorName === 'string' && constructorName.includes('ZodCheckUpperCase'),
            `Constructor name should indicate a ZodCheckUpperCase instance, got "${constructorName}"`
        );

        done();
    });
});
``` 
failed with the following error message:
```
check field should be "string_format"
+ actual - expected

+ undefined
- 'string_format'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.