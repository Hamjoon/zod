let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.iso.time', function(done) {
        // Create a schema for ISO time strings (no parameters)
        const schema = zod.z.iso.time();

        // Valid ISO time strings should parse without throwing
        assert.doesNotThrow(() => schema.parse('00:00:00'));
        assert.doesNotThrow(() => schema.parse('12:34:56'));
        assert.doesNotThrow(() => schema.parse('23:59:59'));

        // Invalid strings should cause a validation error
        assert.throws(() => schema.parse('24:00:00')); // hour out of range
        assert.throws(() => schema.parse('12:60:00')); // minute out of range
        assert.throws(() => schema.parse('12:34:60')); // second out of range
        assert.throws(() => schema.parse('not-a-time')); // completely invalid

        done();
    });
});