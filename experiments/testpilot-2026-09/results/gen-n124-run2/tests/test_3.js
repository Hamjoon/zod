let mocha = require('mocha');
let assert = require('assert');
const { z } = require('zod'); // <-- import the Zod namespace correctly

describe('test zod', function () {
    it('test zod.z.iso.datetime', function (done) {
        // Basic ISO datetime validation (UTC required)
        // `offset: false` forces the trailing "Z" (UTC) to be present
        const utcSchema = z.string().datetime({ offset: false });

        // Valid UTC datetime should pass
        assert.doesNotThrow(() => {
            utcSchema.parse('2023-05-15T12:34:56Z');
        });

        // Missing the trailing "Z" should fail
        assert.throws(() => {
            utcSchema.parse('2023-05-15T12:34:56');
        }, /Invalid/);

        // Local datetime validation (allowing no "Z")
        // `offset: true` permits either a timezone offset or no offset at all
        const localSchema = z.string().datetime({ offset: true });

        // Both UTC and local formats should pass
        assert.doesNotThrow(() => {
            localSchema.parse('2023-05-15T12:34:56Z');
            localSchema.parse('2023-05-15T12:34:56');
        });

        // Custom error message
        const customMsgSchema = z.string().datetime({
            message: 'Custom datetime error',
        });

        try {
            customMsgSchema.parse('invalid-datetime');
        } catch (e) {
            // Zod errors expose the message on the first issue
            assert.ok(e.errors[0].message.includes('Custom datetime error'));
        }

        done();
    });
});