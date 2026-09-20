let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.tuple', function(done) {
        // ----------- Tuple without a rest element -----------
        const basic = zod.tuple([zod.string(), zod.number()]);

        // internal definition checks
        assert.strictEqual(basic._def.type, 'tuple');
        assert.deepStrictEqual(basic._def.items.map(i => i._def.type), ['string', 'number']);
        assert.strictEqual(basic._def.rest, null);

        // parsing valid data
        const parsedBasic = basic.parse(['hello', 42]);
        assert.deepStrictEqual(parsedBasic, ['hello', 42]);

        // parsing invalid data should throw a ZodError
        assert.throws(() => basic.parse(['hello', 'not a number']), zod.ZodError);

        // ----------- Tuple with a rest element -----------
        // Store the rest schema in a variable so we can compare by reference
        const restSchema = zod.number();
        const withRest = zod.tuple([zod.string()], restSchema);

        // rest schema should be stored correctly
        assert.strictEqual(withRest._def.rest, restSchema);

        // parsing with extra rest elements works
        const parsedRest = withRest.parse(['first', 1, 2, 3]);
        assert.deepStrictEqual(parsedRest, ['first', 1, 2, 3]);

        // parsing fails when a rest element does not match the rest schema
        assert.throws(() => withRest.parse(['first', 1, 'bad']), zod.ZodError);

        // ----------- Readonly wrapper -----------
        const readonlyTuple = withRest.readonly();
        assert.strictEqual(readonlyTuple._def.type, 'readonly');
        assert.strictEqual(readonlyTuple._def.inner, withRest);

        done();
    });
});