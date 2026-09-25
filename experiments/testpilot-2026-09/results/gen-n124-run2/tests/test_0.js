let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.iso.datetime', function(done) {
        // Create the ISO datetime schema
        const schema = zod.z.iso.datetime();

        // A valid ISO 8601 datetime string should pass validation
        const validDatetime = '2023-05-15T13:45:30Z';
        assert.doesNotThrow(() => schema.parse(validDatetime), 'Valid ISO datetime threw an error');

        // An invalid datetime string should fail validation
        const invalidDatetime = 'not-a-datetime';
        assert.throws(() => schema.parse(invalidDatetime), /invalid/i, 'Invalid datetime did not throw');

        done();
    });
});