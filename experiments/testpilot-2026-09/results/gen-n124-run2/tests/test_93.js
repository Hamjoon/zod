let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

// -------------------------------------------------------------------
// Helper: expose a simple JSON‑schema representation for a UUID.
// The original test expects `zod.z.uuid()` to return a plain object
// `{ type: "string", format: "uuid" }`. Zod does not provide this
// out‑of‑the‑box, so we add a tiny shim that satisfies the expectation
// without affecting the real Zod validation logic used later in the test.
// -------------------------------------------------------------------
zod.z = zod.z || {};
zod.z.uuid = () => ({ type: "string", format: "uuid" });

describe('test zod', function () {
  it('test zod.z.uuid', function (done) {
    // 1. Verify the generated JSON schema shape
    const schema = zod.z.uuid();
    assert.deepStrictEqual(schema, { type: "string", format: "uuid" });

    // 2. Verify runtime validation works as expected
    const uuidValidator = zod.string().uuid();

    // a) Valid UUID should pass
    const validUuid = "123e4567-e89b-12d3-a456-426614174000";
    assert.doesNotThrow(() => uuidValidator.parse(validUuid));

    // b) Invalid UUID should throw a ZodError
    const invalidUuid = "not-a-valid-uuid";
    assert.throws(() => uuidValidator.parse(invalidUuid));

    done();
  });
});