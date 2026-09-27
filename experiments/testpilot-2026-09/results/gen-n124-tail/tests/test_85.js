let mocha = require('mocha');
let assert = require('assert');
const { z } = require('zod'); // import the Zod namespace directly

describe('test zod', function () {
    it('test zod.z.getErrorMap', function (done) {
        // Retrieve the current error map using the correct Zod API
        const errorMap = z.getErrorMap();

        // It should be a function
        assert.strictEqual(typeof errorMap, 'function');

        // Call the error map with a known error code to verify default behavior
        const result = errorMap(
            {
                code: 'invalid_type',
                path: [],
                expected: 'string',
                received: 123,
            },
            { defaultError: 'Default error' }
        );

        // The result should be an object containing a string `message`
        assert.ok(result && typeof result.message === 'string');

        done();
    });
});