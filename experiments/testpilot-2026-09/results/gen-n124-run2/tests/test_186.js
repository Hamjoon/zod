let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.jwt', function(done) {
        // Create the JWT schema
        const schema = zod.z.jwt();

        // A minimal but syntactically valid JWT (header.payload.signature)
        const validJwt = 'a.b.c';

        // Parsing a valid JWT should succeed and return the original string
        try {
            const parsed = schema.parse(validJwt);
            assert.strictEqual(parsed, validJwt);
        } catch (err) {
            return done(err);
        }

        // An invalid JWT (does not match the three‑part pattern) should throw
        const invalidJwt = 'not-a-jwt';
        assert.throws(() => schema.parse(invalidJwt));

        done();
    });
});