let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.lowercase', function(done) {
        // Create a schema that requires a lowercase string
        const schema = zod.z.string().lowercase();

        // A valid lowercase string should parse without throwing
        assert.doesNotThrow(() => {
            schema.parse('hello world');
        });

        // An uppercase string should cause a validation error
        assert.throws(() => {
            schema.parse('Hello World');
        });

        done();
    });
});