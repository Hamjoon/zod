let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.readonly', function(done) {
        // Test the wrapper method .readonly()
        const objSchema = zod.object({ name: zod.string() }).readonly();
        // Verify internal definition
        assert.strictEqual(objSchema._def.type, "readonly");
        assert.strictEqual(objSchema._def.innerType._def.type, "object");
        // Parse a valid value
        const parsedObj = objSchema.parse({ name: "fido" });
        assert.deepStrictEqual(parsedObj, { name: "fido" });

        // Test readonly on an array schema
        const arrSchema = zod.array(zod.string()).readonly();
        assert.strictEqual(arrSchema._def.type, "readonly");
        const parsedArr = arrSchema.parse(["a", "b"]);
        assert.deepStrictEqual(parsedArr, ["a", "b"]);

        // Test the low‑level zod.z.readonly() function directly
        const directReadonly = zod.z.readonly(zod.string());
        assert.strictEqual(directReadonly._def.type, "readonly");
        assert.strictEqual(directReadonly._def.innerType._def.type, "string");
        const parsedStr = directReadonly.parse("hello");
        assert.strictEqual(parsedStr, "hello");

        done();
    });
});