let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nanoid', function(done) {
        // default nanoid (no parameters)
        const idDefault = zod.z.nanoid();
        assert.strictEqual(typeof idDefault, 'string', 'nanoID should be a string');
        assert.ok(idDefault.length > 0, 'nanoID should have a length greater than 0');
        assert.match(idDefault, /^[A-Za-z0-9_-]+$/, 'nanoID should contain only URL‑safe characters');

        // custom length nanoid (pass a size as a number)
        const customSize = 10;
        const idCustom = zod.z.nanoid(customSize);
        assert.strictEqual(typeof idCustom, 'string', 'custom nanoID should be a string');
        assert.strictEqual(idCustom.length, customSize, `custom nanoID should be ${customSize} characters long`);
        assert.match(idCustom, /^[A-Za-z0-9_-]+$/, 'custom nanoID should contain only URL‑safe characters');

        done();
    });
});