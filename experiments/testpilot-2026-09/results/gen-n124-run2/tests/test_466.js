let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.pipe', function(done) {
        // Create simple input and output schemas – any Zod schema will do.
        const inSchema = zod.string();
        const outSchema = zod.number();

        // Call the pipe function.
        const pipe = zod.z.pipe(inSchema, outSchema);

        // Verify that the returned object is a ZodPipe instance.
        assert(pipe instanceof zod.ZodPipe, 'Result should be an instance of ZodPipe');

        // Verify the internal structure of the pipe object.
        assert.strictEqual(pipe.type, 'pipe', 'type should be "pipe"');
        assert.strictEqual(pipe.in, inSchema, 'in property should reference the input schema');
        assert.strictEqual(pipe.out, outSchema, 'out property should reference the output schema');

        done();
    });
});