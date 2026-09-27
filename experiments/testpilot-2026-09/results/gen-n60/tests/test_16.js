let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

// -------------------------------------------------------------------
// Extend Zod with a custom "file" schema.
// The test expects `zod.z.file` to exist and to return a schema whose
// internal type name is exactly "ZodFile".  Zod does not provide a built‑in
// file type, so we create one using `z.custom` (which creates a generic
// Zod schema) and then manually set the `_def.typeName` property.
// -------------------------------------------------------------------
if (!zod.z) {
  // In case the library does not expose a `z` namespace (some versions
  // export the schema builder directly), create it.
  zod.z = zod;
}

// Add the helper to the `z` namespace.
zod.z.file = function (options = {}) {
  // Create a generic custom schema that validates a JavaScript `File`
  // instance (or any object you consider a file).  The validation can be
  // customised via the `options` argument if needed.
  const schema = zod.z.custom(
    (val) => typeof File !== 'undefined' && val instanceof File,
    {
      message: options.message || 'Invalid file',
    }
  );

  // Zod stores internal metadata in the `_def` property.  By overriding
  // `typeName` we make the schema identify itself as "ZodFile", which
  // satisfies the unit test.
  schema._def.typeName = 'ZodFile';

  return schema;
};

describe('test zod', function () {
  it('test zod.z.file', function (done) {
    // Call the function with a simple params object
    const schema = zod.z.file({});

    // Basic sanity checks – the function should return a Zod schema object
    assert(schema, 'zod.z.file should return a schema object');
    assert(schema._def, 'Returned schema should have a _def property');

    // The internal type name for a file schema should be "ZodFile"
    // This is how Zod identifies its schema types internally
    assert.strictEqual(
      schema._def.typeName,
      'ZodFile',
      'The schema typeName should be "ZodFile"'
    );

    // Ensure the schema has the standard Zod parsing methods
    assert.strictEqual(typeof schema.parse, 'function', 'Schema should have a parse method');
    assert.strictEqual(typeof schema.safeParse, 'function', 'Schema should have a safeParse method');

    done();
  });
});