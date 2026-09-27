let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uuidv4', function(done) {
        // Generate a UUID v4 without parameters
        const uuid = zod.z.uuidv4();

        // Regular expression for a UUID v4
        const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        // Basic type check
        assert.ok(typeof uuid === 'string', 'uuid should be a string');

        // Validate format
        assert.ok(uuidV4Regex.test(uuid), `Generated UUID "${uuid}" does not match UUID v4 format`);

        // Generate a UUID v4 with an empty options object (if the function accepts params)
        const uuidWithParams = zod.z.uuidv4({});

        // Validate format again
        assert.ok(uuidV4Regex.test(uuidWithParams), `Generated UUID with params "${uuidWithParams}" does not match UUID v4 format`);

        done();
    });
});