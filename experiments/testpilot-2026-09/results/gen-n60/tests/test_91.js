let assert = require('assert');
let { v6: uuidv6 } = require('uuid');   // use the uuid library to generate a v6 UUID

describe('test uuid v6 generation', function () {
    it('generates a valid uuid v6', function () {
        // Generate a UUID v6 using the uuid library
        const uuid = uuidv6();

        // Verify that the result is a string
        assert.strictEqual(typeof uuid, 'string');

        // UUID v6 format:
        // - 8-4-4-4-12 hex digits
        // - version nibble (13th hex digit) must be '6'
        // - variant nibble (first of the 4th group) must be one of 8,9,a,b
        const uuidV6Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-6[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        // Assert that the generated UUID matches the v6 pattern
        assert.ok(uuidV6Regex.test(uuid), `Generated UUID does not match v6 format: ${uuid}`);
    });
});