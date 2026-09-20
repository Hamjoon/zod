let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.parseAsync', function(done) {
        // Define a schema with an asynchronous refinement
        const schema = zod.z.string().refine(async (val) => {
            // Simulate async work (e.g., a DB lookup)
            await new Promise(r => setTimeout(r, 10));
            return val === 'hello';
        }, { message: 'must be hello' });

        // First, test a valid value
        schema.parseAsync('hello')
            .then(result => {
                assert.strictEqual(result, 'hello');

                // Then, test an invalid value
                return schema.parseAsync('world')
                    .then(() => {
                        // If we get here, the validation didn't fail as expected
                        done(new Error('Expected validation error for invalid input'));
                    })
                    .catch(err => {
                        // Ensure the error is a ZodError with the correct message
                        assert(err instanceof zod.ZodError);
                        assert.strictEqual(err.errors[0].message, 'must be hello');
                        done();
                    });
            })
            .catch(err => done(err));
    });
});