let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.url', function(done) {
        // Create a URL schema that only allows the https protocol
        const schema = zod.z.url({ protocol: /^https$/ });

        // Should accept a valid https URL
        assert.doesNotThrow(() => {
            schema.parse('https://example.com');
        }, 'Valid https URL should not throw');

        // Should reject an http URL
        assert.throws(() => {
            schema.parse('http://example.com');
        }, /Invalid/, 'Non‑https URL should throw');

        done();
    });
});