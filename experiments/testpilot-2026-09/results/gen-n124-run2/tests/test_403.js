let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.file', function(done) {
        // Mock a simple file-like object
        const file = { name: 'test.txt', size: 500, type: 'text/plain' };
        // Create a Zod schema that validates a file with a maxSize of 1000 bytes
        const schema = zod.z.file({ maxSize: 1000 });
        try {
            // Should succeed for a file within the size limit
            const parsed = schema.parse(file);
            assert.deepStrictEqual(parsed, file);

            // Create a file that exceeds the maxSize limit
            const tooLargeFile = { name: 'big.txt', size: 1500, type: 'text/plain' };
            // Parsing should throw a validation error
            assert.throws(() => schema.parse(tooLargeFile));

            done();
        } catch (err) {
            done(err);
        }
    });
});