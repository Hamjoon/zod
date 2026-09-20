let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.array', function(done) {
        const { z } = zod; // extract the Zod namespace

        // 1️⃣ Simple array of numbers
        const numArray = z.array(z.number());
        assert.deepStrictEqual(numArray.parse([1, 2, 3]), [1, 2, 3]);
        assert.throws(() => numArray.parse([1, 'a', 3]), /Expected number/);

        // 2️⃣ superRefine: length limit and duplicate detection
        const strings = z.array(z.string()).superRefine((val, ctx) => {
            if (val.length > 3) {
                ctx.addIssue({
                    code: z.ZodIssueCode.too_big,
                    maximum: 3,
                    type: "array",
                    inclusive: true,
                    message: "Too many items"
                });
            }
            if (new Set(val).size !== val.length) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "No duplicates allowed."
                });
            }
        });

        // valid case
        assert.deepStrictEqual(strings.parse(['a', 'b', 'c']), ['a', 'b', 'c']);

        // too many items
        const errTooMany = assert.throws(() => strings.parse(['a', 'b', 'c', 'd']));
        assert.ok(errTooMany.issues.some(i => i.code === z.ZodIssueCode.too_big));

        // duplicate items
        const errDup = assert.throws(() => strings.parse(['a', 'b', 'a']));
        assert.ok(errDup.issues.some(i => i.code === z.ZodIssueCode.custom));

        // 3️⃣ Lazy recursive schema (tree structure)
        const node = z.object({
            value: z.string(),
            children: z.lazy(() => node.array())
        });

        const tree = {
            value: 'root',
            children: [
                { value: 'child1', children: [] },
                { value: 'child2', children: [{ value: 'grandchild', children: [] }] }
            ]
        };

        const parsedTree = node.parse(tree);
        assert.deepStrictEqual(parsedTree, tree);

        done();
    });
});