let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.readonly', function (done) {
        // Create a simple inner schema
        const inner = zod.z.string();

        // Apply readonly to the inner schema
        const readonlySchema = zod.z.readonly(inner);

        // Verify that the returned schema is a ZodReadonly instance
        // Zod exposes the type name via the _def.typeName property.
        // Use the enum exported by Zod for a reliable comparison.
        assert.strictEqual(
            readonlySchema._def.typeName,
            zod.z.ZodFirstPartyTypeKind.ZodReadonly,
            'Expected the schema to be a ZodReadonly'
        );

        // Verify that the inner type is correctly stored
        // The inner type is stored under _def.innerType.
        assert.strictEqual(
            readonlySchema._def.innerType,
            inner,
            'Expected the inner type to match the original schema'
        );

        // Ensure parsing works as expected
        const parsed = readonlySchema.parse('hello world');
        assert.strictEqual(parsed, 'hello world');

        // The readonly wrapper should not alter the parsed value
        // (readonly is a TypeScript compile‑time feature, not runtime)
        // So we just confirm the value is unchanged
        assert.deepStrictEqual(parsed, 'hello world');

        done();
    });
});