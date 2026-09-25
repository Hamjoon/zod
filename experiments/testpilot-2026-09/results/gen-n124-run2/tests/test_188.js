let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.jwt', function(done) {
        // Obtain the JWT schema
        const jwtSchema = zod.z.jwt();

        // A simple, well‑formed JWT (header.payload.signature) with base64url parts.
        // Header: {"alg":"HS256","typ":"JWT"}
        // Payload: {"sub":"1234567890","name":"John Doe","iat":1516239022}
        const validJwt = [
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", // header
            "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ", // payload
            "c2lnbmF0dXJl" // dummy signature
        ].join('.');

        // An invalid JWT (missing parts)
        const invalidJwt = "not.a.jwt";

        // The schema should accept a correctly formatted JWT without throwing.
        assert.doesNotThrow(() => {
            jwtSchema.parse(validJwt);
        }, 'Valid JWT should not throw');

        // The schema should reject an incorrectly formatted JWT.
        assert.throws(() => {
            jwtSchema.parse(invalidJwt);
        }, /Invalid/, 'Invalid JWT should throw');

        done();
    });
});