let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.string().endsWith', function (done) {
        // basic suffix check using Zod's string schema
        const suffix = 'world';
        const schema = zod.z.string().endsWith(suffix);

        // the schema should accept strings that end with the suffix
        const valid = schema.safeParse('hello ' + suffix);
        assert.strictEqual(valid.success, true, 'string ending with suffix should be valid');

        // and reject strings that do not end with the suffix
        const invalid = schema.safeParse('hello there');
        assert.strictEqual(invalid.success, false, 'string not ending with suffix should be invalid');

        // ensure that extra params can be merged via .refine (as Zod does not support arbitrary
        // extra keys on the schema definition). Here we add a custom refinement just to
        // demonstrate merging of extra behaviour.
        const extra = { custom: 'value' };
        const schemaWithExtra = zod.z
            .string()
            .endsWith(suffix)
            .refine((val) => true, { message: extra.custom });

        // The custom message should be stored in the refinement's params
        const refinement = schemaWithExtra._def.checks.find(c => c.kind === 'refinement');
        assert.ok(refinement, 'refinement should exist');
        assert.strictEqual(refinement.params?.message, extra.custom, 'custom param should be merged');

        done();
    });
});