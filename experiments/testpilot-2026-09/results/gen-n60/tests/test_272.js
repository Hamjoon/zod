let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.maxSize', function(done) {
        // Build a string schema that enforces a maximum size of 5 characters
        const schema = zod.z.set(zod.z.string()).check(zod.z.maxSize(5));

        // A string whose length is exactly 5 should pass without throwing
        assert.doesNotThrow(() => schema.check('hello'));

        // A string longer than 5 characters should cause the maxSize check to fail
        assert.throws(() => schema.check('hello!'), /maxSize/);

        done();
    });
});