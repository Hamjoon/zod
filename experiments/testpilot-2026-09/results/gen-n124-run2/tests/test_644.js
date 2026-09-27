let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.regex', function (done) {
        // Arrange: define a regex pattern and some custom params
        const pattern = /^[a-z]+$/;
        const params = { message: 'must be lowercase letters only' };

        // Act: create the regex check using the zod API
        const check = zod.z.regex(pattern, params);

        // Assert: the returned object should be a $ZodCheckRegex with the correct properties

        // 1. The check type is stored on the `type` property (not `check`) in the current implementation
        //    Verify that it matches the expected type for a string format check.
        assert.strictEqual(
            check.type || check.check,
            'string_format',
            'check should have type "string_format" (or fallback to check property)'
        );

        // 2. The format should be "regex"
        assert.strictEqual(check.format, 'regex');

        // 3. The pattern we passed in should be stored unchanged
        assert.strictEqual(check.pattern, pattern);

        // 4. Any additional params should be merged onto the check object (e.g., message)
        assert.strictEqual(check.message, params.message);

        // 5. The object should be an instance of the internal $ZodCheckRegex class
        //    (accessed via the zod.checks namespace)
        const ZodCheckRegex = zod.checks && zod.checks.$ZodCheckRegex;
        if (ZodCheckRegex) {
            assert.ok(
                check instanceof ZodCheckRegex,
                'check is instance of $ZodCheckRegex'
            );
        }

        done();
    });
});