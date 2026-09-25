const { z, ZodPipe } = require('zod');
const assert = require('assert');

describe('test zod', function () {
  it('test zod.z.pipe', function (done) {
    // Create simple input and output schemas – any Zod schema will do.
    const inSchema = z.string();
    const outSchema = z.number();

    // Use the instance method `pipe` (the static helper `z.z.pipe` does not exist).
    const pipe = inSchema.pipe(outSchema);

    // Verify that the returned object is a ZodPipe instance.
    assert(pipe instanceof ZodPipe, 'Result should be an instance of ZodPipe');

    // Verify the internal structure of the pipe object.
    // Zod stores the kind in the internal `_def.type` property.
    assert.strictEqual(pipe._def.type, 'ZodPipe', 'type should be "ZodPipe"');
    assert.strictEqual(pipe._def.in, inSchema, 'in property should reference the input schema');
    assert.strictEqual(pipe._def.out, outSchema, 'out property should reference the output schema');

    done();
  });
});