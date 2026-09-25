let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.toUpperCase', function(done) {
        const upper = zod.z.toUpperCase();
        // basic string
        assert.strictEqual(upper('hello'), 'HELLO');
        // mixed characters
        assert.strictEqual(upper('World123'), 'WORLD123');
        // empty string
        assert.strictEqual(upper(''), '');
        done();
    });
});