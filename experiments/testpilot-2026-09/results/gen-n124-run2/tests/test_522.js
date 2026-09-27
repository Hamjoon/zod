let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.instanceof', function(done) {
        // Define a simple class to test against
        class Test {
            constructor() {
                this.name = 'example';
            }
        }

        // Create a Zod schema that validates instances of Test
        const TestSchema = zod.instanceof(Test);

        // ---- Positive case: should parse successfully ----
        const validInstance = new Test();
        const parsed = TestSchema.parse(validInstance);
        // The parsed value should be exactly the instance we passed in
        assert.strictEqual(parsed, validInstance);

        // ---- Negative case: should throw a ZodError ----
        // Using a plain object (not an instance of Test)
        assert.throws(
            () => TestSchema.parse({ name: 'not a Test instance' }),
            (err) => {
                // Ensure it's a ZodError and contains the default message
                return err instanceof zod.ZodError &&
                       /Input not instance of Test/.test(err.message);
            },
            'Expected a ZodError with the default message for non‑instance input'
        );

        done();
    });
});