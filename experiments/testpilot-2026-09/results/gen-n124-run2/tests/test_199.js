let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.int', function(done) {
        // Create an integer schema using the function under test
        const schema = zod.z.int();

        // A valid integer should parse without throwing
        assert.doesNotThrow(() => schema.parse(42));

        // Non‑integer numbers should be rejected
        assert.throws(() => schema.parse(42.5));

        // Non‑numeric values should also be rejected
        assert.throws(() => schema.parse('42'));

        done();
    });
});