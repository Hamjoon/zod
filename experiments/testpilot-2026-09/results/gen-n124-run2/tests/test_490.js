let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.promise', function(done) {
        const schema = zod.z.promise(zod.z.string());

        const goodPromise = Promise.resolve('hello world');
        const badPromise = Promise.resolve(42);

        const goodCheck = schema.parseAsync(goodPromise).then(value => {
            assert.strictEqual(value, 'hello world');
        });

        const badCheck = schema.parseAsync(badPromise).then(() => {
            // Should not succeed
            assert.fail('Validation should have failed for a non‑string value');
        }).catch(err => {
            // Expected an error
            assert.ok(err);
        });

        Promise.all([goodCheck, badCheck])
            .then(() => done())
            .catch(done);
    });
});