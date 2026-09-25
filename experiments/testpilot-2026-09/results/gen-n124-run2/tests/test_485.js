let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.templateLiteral', function(done) {
        // 1. Simple template with a string placeholder (non‑empty)
        const hello = zod.string().templateLiteral([
            "hello, ",
            zod.string().min(1), // require at least one character
            "!"
        ]);
        assert.strictEqual(hello.parse("hello, world!"), "hello, world!");
        assert.throws(() => hello.parse("hello, !"));

        // 2. Template consisting of a static literal only
        const staticLit = zod.string().templateLiteral(["hi there"]);
        assert.strictEqual(staticLit.parse("hi there"), "hi there");
        assert.throws(() => staticLit.parse("hi there!"));

        // 3. Nullable literal (`grassy` | `null`)
        const nullable = zod.string().templateLiteral([
            zod.nullable(zod.literal("grassy"))
        ]);
        assert.strictEqual(nullable.parse("grassy"), "grassy");
        assert.strictEqual(nullable.parse(null), null);
        assert.throws(() => nullable.parse("grass"));

        // 4. Number followed by an enum (CSS units)
        const css = zod.string().templateLiteral([
            zod.number(),
            zod.enum(["px", "em", "rem"])
        ]);
        assert.strictEqual(css.parse("12px"), "12px");
        assert.strictEqual(css.parse("0em"), "0em");
        assert.strictEqual(css.parse("3rem"), "3rem");
        assert.throws(() => css.parse("12pt"));

        // 5. Template with refined string parts (email example)
        const email = zod.string().templateLiteral([
            zod.string().min(1),
            "@",
            zod.string().max(64)
        ]);
        assert.strictEqual(email.parse("a@b"), "a@b");
        assert.throws(() => email.parse("@b")); // first part empty
        const longLocal = "a".repeat(65);
        assert.throws(() => email.parse(`${longLocal}@example.com`)); // exceeds max length

        done();
    });
});