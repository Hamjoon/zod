let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.toLowerCase', function(done) {
        // 1. Basic transformation: mixed case input should become lower case
        const schema1 = zod.string().toLowerCase();
        const res1 = schema1.safeParse('HeLLo WoRLd');
        assert.strictEqual(res1.success, true, 'Parsing should succeed');
        assert.strictEqual(res1.data, 'hello world', 'String should be transformed to lower case');

        // 2. Already lower case input should remain unchanged
        const schema2 = zod.string().toLowerCase();
        const res2 = schema2.safeParse('already lower');
        assert.strictEqual(res2.success, true, 'Parsing should succeed for already lower case');
        assert.strictEqual(res2.data, 'already lower', 'String should stay the same');

        // 3. Integration with other string constraints (min length) – ensure transformation happens before validation
        const schema3 = zod.string().min(5).toLowerCase();
        const res3 = schema3.safeParse('ABCd'); // length 4 after lowercasing, should fail min(5)
        assert.strictEqual(res3.success, false, 'Parsing should fail due to min length after transformation');
        assert.ok(res3.error.issues.some(issue => issue.code === 'too_small'), 'Error should be about too_small');

        // 4. Ensure that toLowerCase does not affect non‑string inputs (should produce a type error)
        const schema4 = zod.string().toLowerCase();
        const res4 = schema4.safeParse(12345);
        assert.strictEqual(res4.success, false, 'Parsing non‑string should fail');
        assert.ok(res4.error.issues.some(issue => issue.code === 'invalid_type'), 'Error should be about invalid_type');

        done();
    });
});