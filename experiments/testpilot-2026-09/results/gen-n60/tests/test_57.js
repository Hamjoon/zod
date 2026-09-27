let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.date', function(done) {
        // Create a date schema with a min and max bound
        const schema = zod.z.date({
            min: new Date('2020-01-01T00:00:00.000Z'),
            max: new Date('2020-12-31T23:59:59.999Z')
        });

        // A date inside the range should pass validation
        assert.doesNotThrow(() => schema.parse(new Date('2020-06-15T12:00:00.000Z')));

        // Dates outside the range should fail validation
        assert.throws(() => schema.parse(new Date('2019-12-31T23:59:59.999Z')));
        assert.throws(() => schema.parse(new Date('2021-01-01T00:00:00.000Z')));

        // Non‑Date values should also fail validation
        assert.throws(() => schema.parse('2020-06-15'));
        assert.throws(() => schema.parse(1600000000000));
        assert.throws(() => schema.parse({}));

        done();
    });
});