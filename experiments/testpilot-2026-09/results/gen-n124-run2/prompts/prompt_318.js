The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.object', function(done) {
        // 1️⃣ Create a basic object schema
        const base = zod.object({
            first: zod.string(),
            second: zod.number(),
        });

        // 2️⃣ The `shape` getter should return a *copy* of the internal shape.
        const shapeCopy = base.shape;
        shapeCopy.extra = zod.boolean(); // mutate the copy
        assert(!('extra' in base.shape), 'original shape must not be mutated by the getter');

        // 3️⃣ Valid parsing works
        const validObj = { first: 'alice', second: 42 };
        assert.deepStrictEqual(base.parse(validObj), validObj);

        // 4️⃣ Invalid parsing throws a ZodError
        assert.throws(() => base.parse({ first: 'bob', second: 'not a number' }), zod.ZodError);

        // 5️⃣ `.nullable()` creates a schema that also accepts `null`
        const nullable = base.nullable();
        assert.strictEqual(nullable.safeParse(null).success, true);
        assert.deepStrictEqual(nullable.parse(validObj), validObj);

        // 6️⃣ `.superRefine()` can add a custom issue (here we check for null)
        const superSchema = base.superRefine((arg, ctx) => {
            if (!arg) {
                ctx.addIssue({
                    code: zod.ZodIssueCode.custom,
                    message: 'object should exist',
                });
            }
            // The return value is ignored; we return `zod.NEVER` just to satisfy typing.
            return zod.NEVER;
        });
        const superResult = superSchema.safeParse(null);
        assert.strictEqual(superResult.success, false);
        assert(superResult.error.issues.some(i => i.message === 'object should exist'));

        // 7️⃣ `.refine()` enforces a custom predicate
        const refined = base.refine(
            (obj) => obj.first === 'bob',
            { message: '`first` is not `bob`!' }
        );
        // passes when predicate is true
        assert.deepStrictEqual(
            refined.parse({ first: 'bob', second: 1 }),
            { first: 'bob', second: 1 }
        );
        // fails when predicate is false
        const refinedFail = refined.safeParse({ first: 'alice', second: 1 });
        assert.strictEqual(refinedFail.success, false);
        assert(refinedFail.error.issues.some(i => i.message === '`first` is not `bob`!'));

        done();
    });
});
``` 
failed with the following error message:
```
original shape must not be mutated by the getter  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.