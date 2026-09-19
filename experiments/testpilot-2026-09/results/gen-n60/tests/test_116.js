let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.templateLiteral', function(done) {
        // 1. Simple interpolation with string
        const helloSchema = zod.z.templateLiteral(["hello, ", zod.z.string(), "!"]);
        assert.strictEqual(helloSchema.parse("hello, world!"), "hello, world!");
        assert.throws(() => helloSchema.parse("hello, !"), /Invalid/);

        // 2. Numeric + enum (CSS units)
        const cssUnits = zod.z.enum(["px", "em", "rem", "%"]);
        const cssSchema = zod.z.templateLiteral([zod.z.number(), cssUnits]);
        assert.strictEqual(cssSchema.parse("12px"), "12px");
        assert.strictEqual(cssSchema.parse("5%"), "5%");
        assert.throws(() => cssSchema.parse("abcpx"), /Invalid/);
        assert.throws(() => cssSchema.parse("12pt"), /Invalid/);

        // 3. Email with refinements (min/max)
        const emailSchema = zod.z.templateLiteral([
            zod.z.string().min(1),
            "@",
            zod.z.string().max(64)
        ]);
        // valid email
        assert.strictEqual(emailSchema.parse("a@b"), "a@b");
        // first part empty -> should fail
        assert.throws(() => emailSchema.parse("@b"), /String must contain at least 1 character/);
        // second part too long -> should fail
        const longLocal = "a".repeat(65);
        assert.throws(() => emailSchema.parse(`${longLocal}@b`), /String must contain at most 64 characters/);

        done();
    });
});