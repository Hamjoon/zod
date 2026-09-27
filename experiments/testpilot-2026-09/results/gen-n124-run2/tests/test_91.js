let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');   // <-- correct import – use the `z` helper directly

describe('test zod', function () {
    it('test zod.z.uuid', function (done) {
        // Build a Zod schema that validates a UUID string
        const schema = z.string().uuid();

        // Verify that we received a Zod schema object
        assert.ok(schema && typeof schema === 'object');

        // Zod does not expose JSON‑Schema fields (`type`, `format`) directly.
        // Instead we can inspect the internal definition to ensure it represents
        // a string with a UUID check.
        //
        // • The schema type should be a ZodString
        assert.strictEqual(schema._def.typeName, 'ZodString');

        // • The schema should contain a `uuid` check in its list of validations
        const hasUuidCheck = schema._def.checks.some(
            (c) => c.kind === 'uuid'
        );
        assert.ok(hasUuidCheck, 'UUID check is missing');

        done();
    });
});