let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.lazy', function(done) {
        // Define a recursive schema using z.lazy
        const Node = zod.z.object({
            value: zod.z.string(),
            // children is an optional array of Nodes (recursive)
            children: zod.z.array(zod.z.lazy(() => Node)).optional()
        });

        // A valid recursive structure
        const validData = {
            value: 'root',
            children: [
                { value: 'child1' },
                {
                    value: 'child2',
                    children: [{ value: 'grandchild' }]
                }
            ]
        };

        // Parsing should succeed and return the same structure
        const parsed = Node.parse(validData);
        assert.deepStrictEqual(parsed, validData);

        // An invalid structure (missing required `value` in a child)
        assert.throws(() => {
            Node.parse({
                value: 'root',
                children: [{ foo: 'bar' }]
            });
        }, /Invalid input/);

        done();
    });
});