let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.nativeEnum', function (done) {
    // Define a simple enum‑like object
    const Color = {
      RED: 'RED',
      GREEN: 'GREEN',
      BLUE: 'BLUE',
    };

    // Create a Zod schema using nativeEnum
    const ColorEnum = zod.z.nativeEnum(Color);

    // Verify internal definition (Zod uses `nativeEnum` as the type and stores the enum under `values`)
    assert.strictEqual(ColorEnum._def.type, 'nativeEnum');
    assert.deepStrictEqual(ColorEnum._def.values, Color);

    // Valid values should parse correctly
    assert.strictEqual(ColorEnum.parse('RED'), 'RED');
    assert.strictEqual(ColorEnum.parse('GREEN'), 'GREEN');
    assert.strictEqual(ColorEnum.parse('BLUE'), 'BLUE');

    // Invalid values should throw a ZodError – check that the error message contains the expected text
    assert.throws(
      () => ColorEnum.parse('YELLOW'),
      (err) => {
        // Ensure we got a ZodError and that its message mentions the invalid option
        return (
          err instanceof zod.ZodError &&
          /Invalid option: expected one of/.test(err.errors[0].message)
        );
      },
      'Expected a ZodError with a message about an invalid enum option'
    );

    done();
  });
});