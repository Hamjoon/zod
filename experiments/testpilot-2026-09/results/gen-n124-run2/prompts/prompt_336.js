The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.union', function(done) {
        // Create a union schema of string and number
        const unionSchema = zod.z.union([zod.z.string(), zod.z.number()]);

        // The returned object should be a ZodUnion instance
        assert.strictEqual(unionSchema.constructor.name, 'ZodUnion');

        // The internal definition should contain the original options
        assert.deepStrictEqual(
            unionSchema._def.options.map(opt => opt._def.typeName),
            ['ZodString', 'ZodNumber']
        );

        // Valid values should parse correctly
        assert.strictEqual(unionSchema.parse('hello'), 'hello');
        assert.strictEqual(unionSchema.parse(123), 123);

        // Invalid value should throw a ZodError
        assert.throws(() => unionSchema.parse(true), /Expected/);

        // Using safeParse should indicate failure for invalid input
        const result = unionSchema.safeParse(false);
        assert.strictEqual(result.success, false);
        assert.ok(result.error instanceof zod.ZodError);

        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly deep-equal:
+ actual - expected

  [
+   undefined,
+   undefined
-   'ZodString',
-   'ZodNumber'
  ]
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.