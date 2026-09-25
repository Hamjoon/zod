let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.templateLiteral', function(done) {
        // Arrange: define parts and optional params
        const parts = ['foo', 'bar'];
        const params = { description: 'my template literal' };

        // Act: create the template literal schema
        const schema = zod.z.templateLiteral(parts, params);

        // Assert: verify the returned object is a ZodTemplateLiteral with correct definition
        assert(schema instanceof zod.ZodTemplateLiteral, 'Returned object should be an instance of ZodTemplateLiteral');

        const def = schema._def;
        assert.strictEqual(def.type, 'template_literal', 'Definition type should be "template_literal"');
        assert.deepStrictEqual(def.parts, parts, 'Parts should be stored unchanged');
        assert.strictEqual(def.description, params.description, 'Description should be normalized and stored');

        done();
    });
});