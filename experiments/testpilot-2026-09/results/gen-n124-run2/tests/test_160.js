let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.ipv6', function(done) {
        const result = zod.z.ipv6();
        assert.deepStrictEqual(result, { type: "string", format: "ipv6" });
        done();
    });
});