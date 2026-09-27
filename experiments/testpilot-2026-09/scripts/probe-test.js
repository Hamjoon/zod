let mocha = require('mocha');
let assert = require('assert');
let zod = require('..');
describe('test zod', function() {
    it('test zod.string', function(done) {
        const s = zod.string();
        assert.strictEqual(s.parse('abc'), 'abc');
        assert.throws(() => s.parse(42));
        done();
    })
})
