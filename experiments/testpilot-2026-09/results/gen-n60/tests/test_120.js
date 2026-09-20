let mocha = require('mocha');
let assert = require('assert');
let z = require('zod'); // Zod exports its API directly

describe('test zod', function () {
  it('test zod.z.templateLiteral', function (done) {
    // 1️⃣ Simple template with a string interpolation
    const helloSchema = z.templateLiteral([
      z.literal('hello, '), // static part must be a literal
      z.string(),
      z.literal('!'), // static part must be a literal
    ]);
    assert.strictEqual(helloSchema.parse('hello, world!'), 'hello, world!');
    assert.throws(() => helloSchema.parse('hello, 123!'));

    // 2️⃣ Template consisting of a static literal only
    const hiSchema = z.templateLiteral([z.literal('hi there')]);
    assert.strictEqual(hiSchema.parse('hi there'), 'hi there');
    assert.throws(() => hiSchema.parse('hi there!'));

    // 3️⃣ Nullable literal inside a template
    const grassySchema = z.templateLiteral([z.nullable(z.literal('grassy'))]);
    assert.strictEqual(grassySchema.parse('grassy'), 'grassy');
    assert.strictEqual(grassySchema.parse(null), null);
    assert.throws(() => grassySchema.parse('grass'));

    // 4️⃣ Number followed by an enum (e.g., CSS units)
    const cssUnits = z.enum(['px', 'em', 'rem', '%']);
    const cssSchema = z.templateLiteral([z.number(), cssUnits]);
    assert.strictEqual(cssSchema.parse('12px'), '12px');
    assert.strictEqual(cssSchema.parse('0%'), '0%');
    assert.throws(() => cssSchema.parse('12pt'));

    done();
  });
});