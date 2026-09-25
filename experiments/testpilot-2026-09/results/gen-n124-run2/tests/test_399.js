let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.literal', function(done) {
        const { literal } = zod.z;

        // String literal
        const strLit = literal('hello');
        assert.strictEqual(strLit.parse('hello'), 'hello');
        assert.throws(() => strLit.parse('world'), zod.ZodError);

        // Number literal
        const numLit = literal(42);
        assert.strictEqual(numLit.parse(42), 42);
        assert.throws(() => numLit.parse(43), zod.ZodError);

        // Boolean literal
        const boolLit = literal(true);
        assert.strictEqual(boolLit.parse(true), true);
        assert.throws(() => boolLit.parse(false), zod.ZodError);

        // Null literal
        const nullLit = literal(null);
        assert.strictEqual(nullLit.parse(null), null);
        assert.throws(() => nullLit.parse(undefined), zod.ZodError);

        done();
    });
});