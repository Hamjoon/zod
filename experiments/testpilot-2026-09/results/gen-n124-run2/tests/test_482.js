let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // use the Zod namespace directly

describe('test zod', function () {
    it('test zod.z.templateLiteral', function (done) {
        // 1. Simple template with string placeholder
        const tmpl1 = z.templateLiteral(['hello, ', z.string(), '!']);
        assert.strictEqual(tmpl1.parse('hello, world!'), 'hello, world!');
        assert.throws(() => tmpl1.parse('hello world!'));

        // 2. Template consisting of a single literal part
        const tmpl2 = z.templateLiteral([z.literal('hi there')]);
        assert.strictEqual(tmpl2.parse('hi there'), 'hi there');
        assert.throws(() => tmpl2.parse('hi there!'));

        // 3. Number + enum (CSS units)
        const units = z.enum(['px', 'em', 'rem']);
        const tmpl3 = z.templateLiteral([z.number(), units]);
        assert.strictEqual(tmpl3.parse('12px'), '12px');
        assert.strictEqual(tmpl3.parse('0.5em'), '0.5em');
        assert.throws(() => tmpl3.parse('12pt'));

        // 4. Nullable literal inside a template literal
        // Wrap the template literal in `z.nullable` so it also accepts `null`
        const tmpl4 = z.nullable(z.templateLiteral([z.literal('grassy')]));
        assert.strictEqual(tmpl4.parse('grassy'), 'grassy');
        assert.strictEqual(tmpl4.parse(null), null);
        assert.throws(() => tmpl4.parse('other'));

        done();
    });
});