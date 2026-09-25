let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.lazy', function(done) {
        // Define a recursive schema using z.lazy
        const nodeSchema = zod.object({
            name: zod.string(),
            // children is an array of the same node type, defined lazily
            children: zod.lazy(() => nodeSchema.array())
        });

        // A valid recursive structure
        const validData = {
            name: "root",
            children: [
                {
                    name: "child1",
                    children: []
                },
                {
                    name: "child2",
                    children: [
                        {
                            name: "grandchild",
                            children: []
                        }
                    ]
                }
            ]
        };

        // Should parse without throwing
        const parsed = nodeSchema.parse(validData);
        assert.deepStrictEqual(parsed, validData, "Parsed data should match the input");

        // An invalid structure: children is not an array
        const invalidData = {
            name: "invalid",
            children: { name: "oops", children: [] } // should be an array
        };

        // Parsing should throw a ZodError
        let threw = false;
        try {
            nodeSchema.parse(invalidData);
        } catch (e) {
            threw = true;
            // Ensure the error is a ZodError and mentions "children"
            assert(e instanceof zod.ZodError, "Error should be a ZodError");
            const issues = e.issues.map(issue => issue.path.join('.'));
            assert(issues.includes('children'), "Error should reference the 'children' path");
        }
        assert(threw, "Parsing invalid data should have thrown an error");

        done();
    });
});