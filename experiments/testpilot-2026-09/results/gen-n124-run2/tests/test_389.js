let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.enum', function (done) {
        const { z } = zod;

        // Basic enum creation and parsing
        const Fruit = z.enum(['Apple', 'Banana', 'Cherry']);
        assert.strictEqual(Fruit.parse('Apple'), 'Apple');
        assert.strictEqual(Fruit.parse('Banana'), 'Banana');

        // Invalid value should throw a ZodError
        // Zod's error message for enums starts with "Invalid option"
        assert.throws(() => Fruit.parse('Durian'), /Invalid option/);

        // Enum used inside a template literal
        const CssUnits = z.enum(['px', 'em', 'rem', '%']);
        const Css = z.templateLiteral([z.number(), CssUnits]);

        // Valid template literal strings
        assert.strictEqual(Css.parse('10px'), '10px');
        assert.strictEqual(Css.parse('5%'), '5%');
        assert.strictEqual(Css.parse('12rem'), '12rem');

        // Invalid template literal should throw
        // Zod's template literal errors contain "Invalid input"
        assert.throws(() => Css.parse('7pt'), /Invalid input/);

        // Internal enum map should be correctly built
        // Zod exposes the enum map via the `.enum` property
        assert.deepStrictEqual(Fruit.enum, {
            Apple: 'Apple',
            Banana: 'Banana',
            Cherry: 'Cherry',
        });

        done();
    });
});