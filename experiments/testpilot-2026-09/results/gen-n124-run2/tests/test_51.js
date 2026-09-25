let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.coerce.date', function(done) {
        const schema = zod.z.coerce.date();

        // Valid ISO string should be coerced to a Date
        const dateFromString = schema.parse('2020-01-01T00:00:00.000Z');
        assert(dateFromString instanceof Date);
        assert.strictEqual(dateFromString.toISOString(), '2020-01-01T00:00:00.000Z');

        // Valid timestamp (number) should be coerced to a Date
        const timestamp = 1609459200000; // 2021-01-01T00:00:00.000Z
        const dateFromNumber = schema.parse(timestamp);
        assert(dateFromNumber instanceof Date);
        assert.strictEqual(dateFromNumber.getTime(), timestamp);

        // Passing an existing Date should return an equivalent Date
        const originalDate = new Date('1999-12-31T23:59:59.000Z');
        const dateFromDate = schema.parse(originalDate);
        assert(dateFromDate instanceof Date);
        assert.strictEqual(dateFromDate.getTime(), originalDate.getTime());

        // Invalid input should throw a ZodError
        assert.throws(() => schema.parse('not a date'), /Invalid/);

        done();
    });
});