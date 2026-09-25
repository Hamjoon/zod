let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.email', function(done) {
        // A valid email should not throw an error
        assert.doesNotThrow(() => {
            zod.z.email('test@example.com');
        }, 'Valid email threw an error');

        // An invalid email should throw an error
        assert.throws(() => {
            zod.z.email('invalid-email');
        }, /email/, 'Invalid email did not throw an error');

        done();
    });
});