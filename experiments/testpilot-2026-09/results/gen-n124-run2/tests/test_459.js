let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nan', function(done) {
        // Create a schema that only accepts NaN
        const schema = zod.z.nan();

        // ✅ Should succeed when the value is NaN
        const ok = schema.safeParse(NaN);
        assert.strictEqual(ok.success, true, 'NaN should be accepted');

        // ❌ Should fail for a regular number
        const notNumber = schema.safeParse(42);
        assert.strictEqual(notNumber.success, false, 'Number should be rejected');

        // ❌ Should fail for a string representation
        const notString = schema.safeParse('NaN');
        assert.strictEqual(notString.success, false, 'String "NaN" should be rejected');

        done();
    });
});