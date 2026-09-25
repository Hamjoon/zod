let mocha = require('mocha');
let assert = require('assert');
// Use the `uuid` package which provides a v6 generator
// (make sure to install it with `npm install uuid`)
// The `v6` function returns a UUID v6 string.
const { v6: uuidv6 } = require('uuid');

describe('test zod', function () {
    it('test uuidv6 generation', function (done) {
        // Generate a UUID v6
        const uuid = uuidv6();

        // It should be a string
        assert.strictEqual(typeof uuid, 'string');

        // UUID v6 format:
        // 8-4-4-4-12 hex digits, version digit = 6, variant = 8/9/a/b
        const uuidV6Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-6[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        // Validate format
        assert.match(uuid, uuidV6Regex, 'Generated value is not a valid UUID v6');

        done();
    });
});