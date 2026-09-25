let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.safeParseAsync', function(done) {
        (async () => {
            // Define a simple schema
            const schema = zod.object({
                name: zod.string(),
                age: zod.number().int()
            });

            // Successful parse
            const successResult = await schema.safeParseAsync({ name: 'Alice', age: 30 });
            assert.strictEqual(successResult.success, true);
            assert.deepStrictEqual(successResult.data, { name: 'Alice', age: 30 });

            // Failing parse
            const failResult = await schema.safeParseAsync({ name: 'Bob', age: 'not a number' });
            assert.strictEqual(failResult.success, false);
            assert.ok(failResult.error);
        })()
        .then(() => done())
        .catch(err => done(err));
    });
});