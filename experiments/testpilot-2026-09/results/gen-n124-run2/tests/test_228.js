let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uint32', function(done) {
        const schema = zod.z.uint32();

        // valid edge values
        assert.doesNotThrow(() => schema.parse(0));
        assert.doesNotThrow(() => schema.parse(4294967295));

        // typical valid value
        assert.doesNotThrow(() => schema.parse(12345));

        // invalid: negative number
        assert.throws(() => schema.parse(-1));

        // invalid: number larger than max uint32
        assert.throws(() => schema.parse(4294967296));

        // invalid: non‑numeric type
        assert.throws(() => schema.parse('123'));

        done();
    });
});