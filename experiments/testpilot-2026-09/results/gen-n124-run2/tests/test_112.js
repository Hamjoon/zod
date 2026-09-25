let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.url', function(done) {
        // basic URL schema – should accept a valid URL
        const schema = zod.z.url();
        assert.doesNotThrow(() => schema.parse('https://example.com'));
        // and reject an obviously invalid string
        assert.throws(() => schema.parse('not-a-url'));

        // URL schema with a protocol restriction (only https allowed)
        const httpsOnly = zod.z.url({ protocol: /^https$/ });
        assert.doesNotThrow(() => httpsOnly.parse('https://secure.com'));
        // http should now be rejected
        assert.throws(() => httpsOnly.parse('http://insecure.com'));

        done();
    });
});