let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.superRefine', function(done) {
        // Schema that adds a string issue when the value is not "ok"
        const schemaStringIssue = zod.string().superRefine((val, ctx) => {
            if (val !== 'ok') {
                ctx.addIssue('Not ok');
            }
        });

        // Schema that adds an object issue when the value is not "ok"
        const schemaObjectIssue = zod.string().superRefine((val, ctx) => {
            if (val !== 'ok') {
                ctx.addIssue({
                    message: 'Invalid value',
                    // code is optional; superRefine will default to "custom"
                });
            }
        });

        // 1. Verify that a string issue is reported correctly
        const resultString = schemaStringIssue.safeParse('bad');
        assert.strictEqual(resultString.success, false, 'Expected validation to fail');
        assert.ok(Array.isArray(resultString.error.issues), 'Issues should be an array');
        assert.strictEqual(resultString.error.issues.length, 1, 'Should have exactly one issue');
        assert.strictEqual(resultString.error.issues[0].message, 'Not ok', 'String issue message should match');

        // 2. Verify that an object issue is reported correctly and has the default "custom" code
        const resultObject = schemaObjectIssue.safeParse('bad');
        assert.strictEqual(resultObject.success, false, 'Expected validation to fail');
        assert.ok(Array.isArray(resultObject.error.issues), 'Issues should be an array');
        assert.strictEqual(resultObject.error.issues.length, 1, 'Should have exactly one issue');
        const issue = resultObject.error.issues[0];
        assert.strictEqual(issue.message, 'Invalid value', 'Object issue message should match');
        // Zod sets the code to "custom" for custom issues if not provided
        assert.strictEqual(issue.code, 'custom', 'Issue code should default to "custom"');

        // 3. Verify that when the value is valid, no issues are produced
        const resultValid = schemaStringIssue.safeParse('ok');
        assert.strictEqual(resultValid.success, true, 'Valid value should pass validation');

        done();
    });
});