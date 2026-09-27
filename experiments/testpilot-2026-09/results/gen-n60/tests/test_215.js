let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.uppercase', function (done) {
        // Helper to safely read the expected fields from either the plain object
        // returned by the custom extension or from the internal Zod definition.
        const getField = (obj, field) => {
            if (Object.prototype.hasOwnProperty.call(obj, field)) return obj[field];
            // Most Zod schemas expose their config under the hidden `_def` property.
            // Guard against the property not existing.
            return obj && obj._def && obj._def[field];
        };

        // 1️⃣  Call without any parameters – should return a check object with the default fields
        const result = zod.z.uppercase();
        assert.ok(result, 'Result should be truthy');

        // The original test expected `result.check` and `result.format`.
        // Depending on the version of the Zod extension, those values might be stored
        // on the returned schema itself or inside its hidden `_def` object.
        const check1 = getField(result, 'check');
        const format1 = getField(result, 'format');

        assert.strictEqual(
            check1,
            'string_format',
            'check field should be "string_format"'
        );
        assert.strictEqual(
            format1,
            'uppercase',
            'format field should be "uppercase"'
        );

        // 2️⃣  Call with a custom parameter – the custom fields should be merged into the result
        const customParams = { customKey: 'customValue' };
        const resultWithCustom = zod.z.uppercase(customParams);
        assert.ok(resultWithCustom, 'Result with custom params should be truthy');

        const check2 = getField(resultWithCustom, 'check');
        const format2 = getField(resultWithCustom, 'format');
        const customValue = getField(resultWithCustom, 'customKey');

        assert.strictEqual(
            check2,
            'string_format',
            'check field should still be "string_format"'
        );
        assert.strictEqual(
            format2,
            'uppercase',
            'format field should still be "uppercase"'
        );
        assert.strictEqual(
            customValue,
            'customValue',
            'Custom parameter should be merged'
        );

        // 3️⃣  Verify that the returned object is an instance of the expected Zod check class
        //    (We fall back to checking the constructor name because the class may not be exported directly)
        const constructorName =
            resultWithCustom.constructor && resultWithCustom.constructor.name;
        assert.ok(
            typeof constructorName === 'string' &&
                constructorName.includes('ZodCheckUpperCase'),
            `Constructor name should indicate a ZodCheckUpperCase instance, got "${constructorName}"`
        );

        done();
    });
});