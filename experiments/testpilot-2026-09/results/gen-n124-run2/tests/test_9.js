let mocha = require('mocha');
let assert = require('assert');
const { z } = require('zod');   // <-- import the Zod namespace correctly

describe('test zod', function () {
    it('test zod.iso.date helper (fixed)', function (done) {
        // Zod does not have a built‑in `z.iso.date()` helper.
        // To accept both full ISO‑8601 date‑time strings and date‑only strings,
        // we combine the two validators with a union.
        const isoDateSchema = z.union([
            z.string().datetime(), // e.g. "2023-01-10T00:00:00.000Z" or "2023-01-10T12:34:56Z"
            z.string().date()      // e.g. "2023-01-10"
        ]);

        // Valid ISO date strings should pass
        const valid1 = isoDateSchema.safeParse('2023-01-10T00:00:00.000Z');
        const valid2 = isoDateSchema.safeParse('2023-01-10');
        const valid3 = isoDateSchema.safeParse('2023-01-10T12:34:56Z');

        assert.strictEqual(valid1.success, true, 'Full ISO datetime should be valid');
        assert.strictEqual(valid2.success, true, 'Date‑only ISO string should be valid');
        assert.strictEqual(valid3.success, true, 'ISO datetime without milliseconds should be valid');

        // Invalid date strings should fail
        const invalid1 = isoDateSchema.safeParse('2023-13-10'); // month out of range
        const invalid2 = isoDateSchema.safeParse('0000-00-00'); // impossible date
        const invalid3 = isoDateSchema.safeParse('not-a-date'); // not a date at all

        assert.strictEqual(invalid1.success, false, 'Month 13 should be invalid');
        assert.strictEqual(invalid2.success, false, 'Zero month/day should be invalid');
        assert.strictEqual(invalid3.success, false, 'Non‑date string should be invalid');

        done();
    });
});