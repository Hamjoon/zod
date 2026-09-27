let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.endsWith', function(done) {
        // Create a schema that requires the string to end with "world"
        const schema = zod.z.string().endsWith('world');

        // Positive case: should not throw
        assert.doesNotThrow(() => {
            schema.parse('hello world');
        });

        // Negative case: should throw a validation error
        assert.throws(() => {
            schema.parse('hello');
        });

        done();
    });
});