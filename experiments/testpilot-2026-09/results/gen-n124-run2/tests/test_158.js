let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.ipv6', function(done) {
        // A valid IPv6 address should not throw
        assert.doesNotThrow(() => {
            // The function may return the normalized address or a truthy value;
            // we only care that it does not raise a validation error.
            zod.z.ipv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334');
        }, 'Valid IPv6 address threw an error');

        // An invalid IPv6 address should throw
        assert.throws(() => {
            zod.z.ipv6('not-an-ipv6-address');
        }, /invalid|IPv6/, 'Invalid IPv6 address did not throw');

        done();
    });
});