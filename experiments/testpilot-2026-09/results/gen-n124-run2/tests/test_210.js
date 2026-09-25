let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.float64', function(done) {
        // Valid input should be accepted and returned unchanged
        const validNumber = 3.1415926535;
        const result = zod.z.float64(validNumber);
        assert.strictEqual(typeof result, 'number');
        assert.strictEqual(result, validNumber);

        // Invalid input should cause an exception
        assert.throws(() => {
            zod.z.float64('not a number');
        });

        done();
    });
});