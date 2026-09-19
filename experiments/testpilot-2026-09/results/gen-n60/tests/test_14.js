let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.file', function(done) {
        // Create a simple mock file object that resembles a typical File/Blob
        const mockFile = {
            name: 'example.txt',
            size: 42,
            type: 'text/plain',
            // Zod's file schema may check for a `lastModified` property; include it just in case
            lastModified: Date.now()
        };

        // Build the schema – no special params are needed for a basic validation
        const fileSchema = zod.z.file();

        // The schema should accept a valid file‑like object without throwing
        assert.doesNotThrow(() => fileSchema.parse(mockFile));

        // The schema should reject non‑file values (e.g., a plain string)
        assert.throws(() => fileSchema.parse('not a file'));

        // The schema should also reject objects missing required file properties
        const incompleteFile = { name: 'bad.txt' };
        assert.throws(() => fileSchema.parse(incompleteFile));

        done();
    });
});