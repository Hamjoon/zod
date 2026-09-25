let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.superRefine', function(done) {
        // Define a schema that uses superRefine to add custom issues
        const schema = zod.object({ a: zod.string() })
            .superRefine((val, ctx) => {
                // Add a simple string issue when the string is too short
                if (val.a.length < 3) {
                    ctx.addIssue('a too short');
                }
                // Add a full issue object when the value equals "bad"
                if (val.a === 'bad') {
                    ctx.addIssue({
                        code: zod.ZodIssueCode.custom,
                        message: 'bad value',
                        path: ['a']
                    });
                }
            });

        // ---- Valid case -------------------------------------------------
        const valid = schema.safeParse({ a: 'abc' });
        assert.strictEqual(valid.success, true, 'Valid input should pass');

        // ---- Short string case (string issue) ---------------------------
        const short = schema.safeParse({ a: 'ab' });
        assert.strictEqual(short.success, false, 'Short input should fail');
        // The first issue should contain the string we added
        const shortIssue = short.error.issues[0];
        assert.strictEqual(shortIssue.message, 'a too short', 'String issue message should match');

        // ---- Bad value case (full issue object) -------------------------
        const bad = schema.safeParse({ a: 'bad' });
        assert.strictEqual(bad.success, false, 'Bad value should fail');
        // Find the issue we added with a custom message
        const badIssue = bad.error.issues.find(i => i.message === 'bad value');
        assert.ok(badIssue, 'Custom issue with message "bad value" should be present');
        // Ensure the path points to the correct property
        assert.deepStrictEqual(badIssue.path, ['a'], 'Issue path should be ["a"]');

        done();
    });
});