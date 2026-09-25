let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.symbol', function(done) {
        // Create a symbol schema (no special params)
        const schema = zod.z.symbol();

        // A valid Symbol should pass validation
        const validSym = Symbol('valid');
        assert.doesNotThrow(() => schema.parse(validSym));

        // A non‑symbol value should fail validation
        assert.throws(() => schema.parse('not a symbol'), zod.ZodError);

        done();
    });
});