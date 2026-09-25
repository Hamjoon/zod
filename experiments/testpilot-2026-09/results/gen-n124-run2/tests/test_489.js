let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.lazy', function(done) {
        // ---- Recursive schema definition using z.lazy ----
        const baseCategory = zod.object({ name: zod.string() });
        const Category = baseCategory.extend({
            subcategories: zod.lazy(() => Category.array())
        });

        // ---- Valid nested data ----
        const validData = {
            name: "Root",
            subcategories: [
                { name: "Child1", subcategories: [] },
                {
                    name: "Child2",
                    subcategories: [
                        { name: "Grandchild", subcategories: [] }
                    ]
                }
            ]
        };

        // Parsing should succeed and return the same structure
        const parsed = Category.parse(validData);
        assert.deepStrictEqual(parsed, validData);

        // ---- Invalid data (subcategories is not an array) ----
        const invalidData = {
            name: "BadRoot",
            subcategories: [
                { name: "BadChild", subcategories: "not-an-array" }
            ]
        };

        // Parsing should throw a ZodError
        assert.throws(() => Category.parse(invalidData), zod.ZodError);

        done();
    });
});