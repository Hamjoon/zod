let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.array', function(done) {
        // 1. Basic array of strings
        const stringArray = zod.array(zod.string());
        const basicPass = stringArray.safeParse(['foo', 'bar']);
        assert.strictEqual(basicPass.success, true, 'basic string array should pass');

        const basicFail = stringArray.safeParse(['foo', 123]);
        assert.strictEqual(basicFail.success, false, 'array with non‑string should fail');

        // 2. Array with min / max constraints
        const limitedNumbers = zod.array(zod.number()).min(2).max(3);
        assert.strictEqual(limitedNumbers.safeParse([1, 2]).success, true, '2 numbers meets min 2');
        assert.strictEqual(limitedNumbers.safeParse([1]).success, false, '1 number violates min 2');
        assert.strictEqual(limitedNumbers.safeParse([1, 2, 3, 4]).success, false, '4 numbers violates max 3');

        // 3. superRefine – no duplicate strings allowed
        const uniqStrings = zod.array(zod.string()).superRefine((val, ctx) => {
            if (new Set(val).size !== val.length) {
                ctx.addIssue({
                    code: zod.ZodIssueCode.custom,
                    message: 'No duplicates allowed.',
                });
            }
        });
        const dupResult = uniqStrings.safeParse(['a', 'b', 'a']);
        assert.strictEqual(dupResult.success, false, 'duplicate strings should fail');
        assert(
            dupResult.error.issues.some(i => i.message === 'No duplicates allowed.'),
            'custom duplicate issue should be present'
        );

        // 4. Lazy recursive schema (tree structure)
        const TreeNode = zod.object({
            value: zod.string(),
        }).extend({
            children: zod.lazy(() => TreeNode.array()),
        });

        const validTree = TreeNode.safeParse({
            value: 'root',
            children: [
                { value: 'child1', children: [] },
                { value: 'child2', children: [{ value: 'grandchild', children: [] }] },
            ],
        });
        assert.strictEqual(validTree.success, true, 'valid recursive tree should pass');

        const invalidTree = TreeNode.safeParse({
            value: 'root',
            children: [
                { value: 123, children: [] }, // invalid: value not a string
            ],
        });
        assert.strictEqual(invalidTree.success, false, 'invalid recursive tree should fail');

        done();
    });
});