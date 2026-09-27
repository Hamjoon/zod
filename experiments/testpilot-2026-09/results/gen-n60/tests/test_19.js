let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
const { File } = require('node:buffer'); // Node's built‑in File implementation

describe('test zod', function () {
  it('test zod.z.file', function (done) {
    // Create a real File instance (Node ≥ 20 provides this globally)
    const mockFile = new File(['example content'], 'example.txt', {
      type: 'text/plain',
      lastModified: Date.now(),
    });

    // Build the Zod file schema
    const fileSchema = zod.z.file();

    // Should accept a valid File instance
    assert.doesNotThrow(() => fileSchema.parse(mockFile));

    // Should reject non‑file values
    assert.throws(() => fileSchema.parse('not a file'));

    // Should reject objects that are not File instances
    const incompleteFile = { name: 'bad.txt' };
    assert.throws(() => fileSchema.parse(incompleteFile));

    done();
  });
});