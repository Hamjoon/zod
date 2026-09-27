// test-zod-file.js
const mocha = require('mocha');
const { describe, it } = mocha;
const assert = require('assert');
const zod = require('zod');

// Node 20+ provides the Web File API globally.
// If you are on an older Node version, you can install a polyfill such as `fetch-blob`
// and use `new File(...)` from that package.
describe('test zod', function () {
  it('test zod.z.file', function (done) {
    // Mock a simple File‑like object using the native File constructor.
    // The content length (in bytes) determines the `size` property.
    const file = new File(['hello world'], 'test.txt', { type: 'text/plain' }); // size = 11

    // Create a Zod schema that validates a File with a maxSize of 1000 bytes
    const schema = zod.z.file({ maxSize: 1000 });

    try {
      // Should succeed for a file within the size limit
      const parsed = schema.parse(file);
      // The parsed value is the original File instance
      assert.strictEqual(parsed, file);

      // Create a file that exceeds the maxSize limit (1500 bytes)
      const tooLargeContent = new Uint8Array(1500); // 1500 zero‑filled bytes
      const tooLargeFile = new File([tooLargeContent], 'big.txt', {
        type: 'text/plain',
      });

      // Parsing should throw a validation error
      assert.throws(() => schema.parse(tooLargeFile));

      done();
    } catch (err) {
      done(err);
    }
  });
});