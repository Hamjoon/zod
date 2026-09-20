let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
let { nanoid } = require('nanoid'); // <-- use the nanoid generator

describe('test zod', function () {
    it('test zod.z.nanoid', function (done) {
        // -----------------------------------------------------------------
        // 1️⃣  Generate a nanoid with the default length (no parameters)
        // -----------------------------------------------------------------
        const idDefault = nanoid();                     // <-- actual string value
        assert.strictEqual(
            typeof idDefault,
            'string',
            'nanoID should be a string'
        );
        assert.ok(idDefault.length > 0, 'nanoID should have a length greater than 0');
        assert.match(idDefault, /^[A-Za-z0-9_-]+$/, 'nanoID should contain only URL‑safe characters');

        // also make sure the Zod schema validates the generated value
        const defaultSchema = zod.z.nanoid();          // <-- Zod schema for a nanoid
        assert.ok(
            defaultSchema.safeParse(idDefault).success,
            'default nanoID should pass Zod validation'
        );

        // -----------------------------------------------------------------
        // 2️⃣  Generate a nanoid with a custom length (pass a size as a number)
        // -----------------------------------------------------------------
        const customSize = 10;
        const idCustom = nanoid(customSize);            // <-- actual string value
        assert.strictEqual(
            typeof idCustom,
            'string',
            'custom nanoID should be a string'
        );
        assert.strictEqual(
            idCustom.length,
            customSize,
            `custom nanoID should be ${customSize} characters long`
        );
        assert.match(idCustom, /^[A-Za-z0-9_-]+$/, 'custom nanoID should contain only URL‑safe characters');

        // validate the custom‑size nanoid with the corresponding Zod schema
        const customSchema = zod.z.nanoid(customSize);
        assert.ok(
            customSchema.safeParse(idCustom).success,
            'custom nanoID should pass Zod validation'
        );

        done();
    });
});