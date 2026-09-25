let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.literal', function(done) {
        // Single literal value
        const single = zod.z.literal('foo');
        // Should parse the exact value
        assert.strictEqual(single.parse('foo'), 'foo');
        // Should reject a different value
        const resultSingle = single.safeParse('bar');
        assert.strictEqual(resultSingle.success, false);
        // Internals should reflect the stored values array
        assert.deepStrictEqual(single._def.values, ['foo']);
        assert.strictEqual(single._def.type, 'literal');

        // Array of literal values
        const multiple = zod.z.literal(['a', 'b', 'c']);
        // Should accept any of the listed values
        assert.strictEqual(multiple.parse('a'), 'a');
        assert.strictEqual(multiple.parse('b'), 'b');
        assert.strictEqual(multiple.parse('c'), 'c');
        // Should reject values not in the list
        const resultMultiple = multiple.safeParse('d');
        assert.strictEqual(resultMultiple.success, false);
        // Internals should store the array as‑is
        assert.deepStrictEqual(multiple._def.values, ['a', 'b', 'c']);
        assert.strictEqual(multiple._def.type, 'literal');

        done();
    });
});