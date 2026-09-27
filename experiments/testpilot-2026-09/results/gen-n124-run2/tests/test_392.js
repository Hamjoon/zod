let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // use the named export `z`

describe('test zod', function () {
  it('test z.enum', function (done) {
    // basic enum validation
    const Colors = z.enum(['red', 'green', 'blue']);

    // the enum should expose its options
    assert.deepStrictEqual(Colors.options, ['red', 'green', 'blue']);

    // valid values are parsed unchanged
    assert.strictEqual(Colors.parse('red'), 'red');
    assert.strictEqual(Colors.parse('green'), 'green');

    // invalid values throw – Zod's error message contains “Invalid option”
    assert.throws(() => Colors.parse('yellow'), /Invalid option/);

    // enum used inside a template literal
    const CssUnits = z.enum(['px', 'em', 'rem', '%']);
    const Css = z.templateLiteral([z.number(), CssUnits]);

    // valid template literal strings are parsed
    assert.strictEqual(Css.parse('12px'), '12px');
    assert.strictEqual(Css.parse('0.5em'), '0.5em');
    assert.strictEqual(Css.parse('100%'), '100%');

    // invalid unit should cause a validation error – again contains “Invalid option”
    assert.throws(() => Css.parse('12pt'), /Invalid option/);

    done();
  });
});