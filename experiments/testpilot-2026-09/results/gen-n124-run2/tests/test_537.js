let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.lt', function(done) {
        // Create a schema that only accepts numbers less than 10
        const schema = zod.z.lt(10);

        // Values that should pass
        assert.doesNotThrow(() => schema.parse(0));
        assert.doesNotThrow(() => schema.parse(9.999));

        // Values that should fail (equal to or greater than the limit)
        assert.throws(() => schema.parse(10), /Invalid/);
        assert.throws(() => schema.parse(11), /Invalid/);
        assert.throws(() => schema.parse('5'), /Invalid/); // wrong type

        done();
    });
});