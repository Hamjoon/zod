let assert = require('assert');
let { z, ZodError } = require('zod');   // pull `z` and the error type directly

describe('test zod', function () {
    it('test zod.z.stringbool', function (done) {
        // default (case‑insensitive) parser
        const strbool = z.stringbool();

        // truthy values should parse to true
        const truthy = ["true", "1", "yes", "on", "y", "enabled"];
        truthy.forEach(v => {
            assert.strictEqual(strbool.parse(v), true, `expected "${v}" to be true`);
        });

        // falsy values should parse to false
        const falsy = ["false", "0", "no", "off", "n", "disabled"];
        falsy.forEach(v => {
            assert.strictEqual(strbool.parse(v), false, `expected "${v}" to be false`);
        });

        // any other value should throw a ZodError with code "invalid_value"
        assert.throws(
            () => strbool.parse("maybe"),
            err => err instanceof ZodError && err.issues.some(e => e.code === "invalid_value"),
            'expected invalid value to throw ZodError'
        );

        // case‑sensitive parser – only exact matches should succeed
        const cs = z.stringbool({ case: "sensitive" });

        // exact matches work
        assert.strictEqual(cs.parse("true"), true);
        assert.strictEqual(cs.parse("false"), false);

        // different case should now be invalid
        assert.throws(
            () => cs.parse("True"),
            err => err instanceof ZodError && err.issues.some(e => e.code === "invalid_value"),
            'expected case‑sensitive mismatch to throw ZodError'
        );

        done();
    });
});