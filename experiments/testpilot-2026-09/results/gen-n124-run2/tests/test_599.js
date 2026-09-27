let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.maxSize', function (done) {
        // Arrange: define a maximum size and some custom parameters
        const maximum = 1024;
        const params = {
            message: 'File is too large',
            // any other custom param you might want to test
            customFlag: true,
        };

        // Act: call the function under test
        // NOTE: In the current Zod implementation `z.maxSize` returns a **Zod schema**
        // object, not a plain object with a `check` property. The relevant information
        // is stored inside the schema’s internal definition (`_def.checks`).
        const result = zod.z.maxSize(maximum, params);

        // ----------------------------------------------------------------------
        // ASSERTIONS – adapted to the actual shape returned by Zod
        // ----------------------------------------------------------------------
        // 1. The returned value must be a Zod schema (i.e. it has a `_def` property)
        assert.ok(result && typeof result === 'object' && '_def' in result,
            'result should be a Zod schema object');

        // 2. The schema should contain a `max_size` check with the expected limit
        const checks = (result._def && result._def.checks) || [];
        const maxSizeCheck = checks.find(ch => ch.kind === 'max_size');

        assert.ok(maxSizeCheck, 'schema should contain a max_size check');
        assert.strictEqual(maxSizeCheck.value, maximum,
            'max_size check should store the correct maximum value');

        // 3. Custom parameters passed to `maxSize` are attached to the check object
        //    (Zod stores them under the `message` and any extra keys you provide)
        Object.keys(params).forEach(key => {
            // Zod only copies `message` into the check; other keys are attached as
            // `params` on the check object. We account for both possibilities.
            const expected = params[key];
            const actual = maxSizeCheck[key] ?? (maxSizeCheck.params && maxSizeCheck.params[key]);

            assert.strictEqual(actual, expected,
                `custom param "${key}" should be preserved on the check`);
        });

        // 4. Sanity – the result is truthy
        assert.ok(result, 'result should be a truthy object');

        done();
    });
});