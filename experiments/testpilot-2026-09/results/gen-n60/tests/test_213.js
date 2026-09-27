let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uppercase', function(done) {
        const input = 'Hello World';
        const result = zod.z.uppercase(input);
        assert.strictEqual(result, 'HELLO WORLD');
        done();
    });
});