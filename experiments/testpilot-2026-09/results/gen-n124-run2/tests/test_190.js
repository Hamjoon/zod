let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.jwt', function(done) {
        // Create a simple, syntactically‑correct JWT (header.payload.signature)
        const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString('base64url');
        const payload = Buffer.from(JSON.stringify({ sub: "1234567890", name: "John Doe", iat: 1516239022 })).toString('base64url');
        const signature = "dummySignature"; // signature content is irrelevant for format validation
        const validJwt = `${header}.${payload}.${signature}`;

        // Build the JWT schema using zod
        const jwtSchema = zod.z.jwt();

        // Validate a correct JWT – should succeed
        const validResult = jwtSchema.safeParse(validJwt);
        assert.strictEqual(validResult.success, true, 'Valid JWT should pass validation');

        // Validate an incorrect JWT – should fail
        const invalidResult = jwtSchema.safeParse('not.a.jwt');
        assert.strictEqual(invalidResult.success, false, 'Invalid JWT should fail validation');

        done();
    });
});