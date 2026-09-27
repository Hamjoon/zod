let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nativeEnum', function(done) {
        // Define a simple enum‑like object
        const Color = {
            RED: 'RED',
            GREEN: 'GREEN',
            BLUE: 'BLUE',
        };

        // Create a Zod schema using nativeEnum
        const ColorEnum = zod.z.nativeEnum(Color);

        // Verify internal definition
        assert.strictEqual(ColorEnum._def.type, 'enum');
        assert.deepStrictEqual(ColorEnum._def.entries, Color);

        // Valid values should parse correctly
        assert.strictEqual(ColorEnum.parse('RED'), 'RED');
        assert.strictEqual(ColorEnum.parse('GREEN'), 'GREEN');
        assert.strictEqual(ColorEnum.parse('BLUE'), 'BLUE');

        // Invalid values should throw a ZodError
        assert.throws(() => ColorEnum.parse('YELLOW'), /Invalid enum value/);

        done();
    });
});