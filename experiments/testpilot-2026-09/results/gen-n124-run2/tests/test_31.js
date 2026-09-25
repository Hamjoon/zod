let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.coerce.string (customized)', function (done) {
        // Custom schema that:
        //  • coerces numbers, booleans and null to strings
        //  • rejects objects (they cannot be sensibly stringified)
        const schema = zod.z.preprocess((val) => {
            // Explicitly handle null – turn it into the string "null"
            if (val === null) return 'null';

            // Reject plain objects (including arrays) – let the downstream
            // string schema fail by returning undefined
            if (typeof val === 'object') return undefined;

            // For everything else (number, boolean, string, etc.) use
            // JavaScript's default string conversion
            return String(val);
        }, zod.z.string());

        // Should coerce numbers to strings
        const numResult = schema.safeParse(12345);
        assert.strictEqual(numResult.success, true);
        assert.strictEqual(numResult.data, '12345');

        // Should coerce booleans to strings
        const boolResult = schema.safeParse(true);
        assert.strictEqual(boolResult.success, true);
        assert.strictEqual(boolResult.data, 'true');

        // Should coerce null to "null"
        const nullResult = schema.safeParse(null);
        assert.strictEqual(nullResult.success, true);
        assert.strictEqual(nullResult.data, 'null');

        // Should fail for objects that cannot be sensibly stringified
        const objResult = schema.safeParse({ key: 'value' });
        assert.strictEqual(objResult.success, false);

        // Should accept already‑string values unchanged
        const strResult = schema.safeParse('already a string');
        assert.strictEqual(strResult.success, true);
        assert.strictEqual(strResult.data, 'already a string');

        done();
    });
});