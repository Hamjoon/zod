let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.readonly', function(done) {
        // readonly should behave like the original schema for primitives
        const readonlyString = zod.z.readonly(zod.z.string());
        const primitive = 'hello world';
        assert.strictEqual(readonlyString.parse(primitive), primitive);

        // readonly should behave like the original schema for objects
        const objSchema = zod.z.object({
            name: zod.z.string(),
            age: zod.z.number(),
        });
        const readonlyObjSchema = zod.z.readonly(objSchema);
        const input = { name: 'Alice', age: 42 };
        const output = readonlyObjSchema.parse(input);
        assert.deepStrictEqual(output, input);

        // The parsed result should still satisfy the original schema
        assert.doesNotThrow(() => objSchema.parse(output));

        done();
    });
});