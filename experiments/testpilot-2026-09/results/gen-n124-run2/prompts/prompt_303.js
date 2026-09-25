The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.array', function(done) {
        // 1️⃣ Simple array validation
        const StringArray = zod.array(zod.string());
        assert.deepStrictEqual(StringArray.parse(['a', 'b', 'c']), ['a', 'b', 'c']);

        // 2️⃣ Validation fails when value is not an array
        try {
            StringArray.parse('not-an-array');
            assert.fail('Expected ZodError for non‑array input');
        } catch (e) {
            assert(e instanceof zod.ZodError);
            const issue = e.errors[0];
            assert.strictEqual(issue.code, zod.ZodIssueCode.invalid_type);
        }

        // 3️⃣ superRefine example – limit length and forbid duplicates
        const LimitedUnique = zod.array(zod.string()).superRefine((val, ctx) => {
            if (val.length > 3) {
                ctx.addIssue({
                    code: zod.ZodIssueCode.too_big,
                    maximum: 3,
                    inclusive: true,
                    type: "array",
                    message: "Too many items 😡",
                });
            }
            if (val.length !== new Set(val).size) {
                ctx.addIssue({
                    code: zod.ZodIssueCode.custom,
                    message: "No duplicates allowed.",
                });
            }
        });

        // valid case
        assert.deepStrictEqual(LimitedUnique.parse(['x', 'y', 'z']), ['x', 'y', 'z']);

        // too many items
        try {
            LimitedUnique.parse(['a', 'b', 'c', 'd']);
            assert.fail('Expected ZodError for too many items');
        } catch (e) {
            assert(e instanceof zod.ZodError);
            const issue = e.errors.find(i => i.code === zod.ZodIssueCode.too_big);
            assert(issue, 'Missing too_big issue');
        }

        // duplicate items
        try {
            LimitedUnique.parse(['dup', 'dup']);
            assert.fail('Expected ZodError for duplicates');
        } catch (e) {
            assert(e instanceof zod.ZodError);
            const issue = e.errors.find(i => i.code === zod.ZodIssueCode.custom);
            assert(issue, 'Missing custom duplicate issue');
        }

        // 4️⃣ Recursive array via lazy (mirrors usage #1)
        const Base = zod.object({ id: zod.string() });
        const Recursive = Base.extend({
            children: zod.lazy(() => Recursive.array())
        });

        const payload = {
            id: "root/0",
            children: [
                {
                    id: "child/1",
                    children: []
                },
                {
                    id: "child/2",
                    children: [
                        { id: "grandchild/1", children: [] }
                    ]
                }
            ]
        };

        const parsed = Recursive.parse(payload);
        assert.deepStrictEqual(parsed, payload);

        done();
    });
});
``` 
failed with the following error message:
```
Cannot read properties of undefined (reading '0')  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.