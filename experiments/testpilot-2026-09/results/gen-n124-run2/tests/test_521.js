let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.instanceof', function(done) {
        // Define a simple class to test against
        class Test {
            constructor() {
                this.name = 'test';
            }
        }

        // Default schema – should accept instances of Test and reject everything else
        const TestSchema = zod.instanceof(Test);
        // Should not throw for a proper instance
        assert.doesNotThrow(() => TestSchema.parse(new Test()));
        // Should throw for a non‑instance (object literal)
        assert.throws(() => TestSchema.parse({}), /Input not instance of Test/);

        // Custom error message – ensure the custom message is used
        const CustomSchema = zod.instanceof(Test, { error: 'Not a Test' });
        assert.throws(() => CustomSchema.parse({}), /Not a Test/);

        done();
    });
});