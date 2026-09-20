let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.parse', function(done) {
        // 1. ISO datetime default (precision undefined) should accept minute, second and ms strings
        const dtDefault = zod.iso.datetime();
        assert.doesNotThrow(() => dtDefault.parse("2020-01-01T06:15Z"));
        assert.doesNotThrow(() => dtDefault.parse("2020-01-01T06:15:00Z"));
        assert.doesNotThrow(() => dtDefault.parse("2020-01-01T06:15:00.123Z"));

        // 2. ISO datetime with minute precision (precision: -1) should reject seconds and ms
        const dtMinute = zod.iso.datetime({ precision: -1 });
        assert.doesNotThrow(() => dtMinute.parse("2020-01-01T06:15Z"));
        assert.throws(() => dtMinute.parse("2020-01-01T06:15:00Z"), /invalid/);
        assert.throws(() => dtMinute.parse("2020-01-01T06:15:00.123Z"), /invalid/);

        // 3. ISO datetime with second precision (precision: 0) should reject minute‑only and ms
        const dtSecond = zod.iso.datetime({ precision: 0 });
        assert.throws(() => dtSecond.parse("2020-01-01T06:15Z"), /invalid/);
        assert.doesNotThrow(() => dtSecond.parse("2020-01-01T06:15:00Z"));
        assert.throws(() => dtSecond.parse("2020-01-01T06:15:00.123Z"), /invalid/);

        // 4. ISO datetime with millisecond precision (precision: 3) should only accept ms format
        const dtMs = zod.iso.datetime({ precision: 3 });
        assert.throws(() => dtMs.parse("2020-01-01T06:15Z"), /invalid/);
        assert.throws(() => dtMs.parse("2020-01-01T06:15:00Z"), /invalid/);
        assert.doesNotThrow(() => dtMs.parse("2020-01-01T06:15:00.123Z"));

        // 5. stringbool should coerce various truthy/falsy strings to booleans
        const sb = zod.stringbool();
        assert.strictEqual(sb.parse("true"), true);
        assert.strictEqual(sb.parse("1"), true);
        assert.strictEqual(sb.parse("yes"), true);
        assert.strictEqual(sb.parse("on"), true);
        assert.strictEqual(sb.parse("y"), true);
        assert.strictEqual(sb.parse("enabled"), true);
        assert.strictEqual(sb.parse("false"), false);
        assert.strictEqual(sb.parse("0"), false);
        assert.strictEqual(sb.parse("no"), false);
        assert.strictEqual(sb.parse("off"), false);
        assert.strictEqual(sb.parse("n"), false);
        assert.strictEqual(sb.parse("disabled"), false);
        assert.throws(() => sb.parse("maybe"), /invalid_value/);

        // 6. Object schema should strip unknown keys (Dog example)
        const Dog = zod.object({ name: zod.string() });
        const result = Dog.parse({ name: "Yeller", extraKey: true });
        assert.deepStrictEqual(result, { name: "Yeller" });

        done();
    });
});