let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.map', function(done) {
        // 1️⃣ basic map schema
        const stringNumberMap = zod.map(zod.string(), zod.number());

        // a valid Map should parse successfully
        const validMap = new Map([
            ['one', 1],
            ['two', 2],
        ]);
        const parsedValid = stringNumberMap.parse(validMap);
        // ensure we still have a Map and the entries are correct
        assert(parsedValid instanceof Map, 'parsed value should be a Map');
        assert.strictEqual(parsedValid.get('one'), 1);
        assert.strictEqual(parsedValid.get('two'), 2);

        // 2️⃣ parsing a Map with an invalid value should throw a ZodError
        const invalidValueMap = new Map([['three', 'not a number']]);
        assert.throws(
            () => stringNumberMap.parse(invalidValueMap),
            (err) => err instanceof zod.ZodError,
            'Expected ZodError for invalid value type'
        );

        // 3️⃣ parsing a Map with an invalid key should also throw a ZodError
        const invalidKeyMap = new Map([[123, 123]]);
        assert.throws(
            () => stringNumberMap.parse(invalidKeyMap),
            (err) => err instanceof zod.ZodError,
            'Expected ZodError for invalid key type'
        );

        // 4️⃣ readonly map schema (type‑level only, runtime behaves like ordinary Map)
        const readonlyStringDateMap = zod.map(zod.string(), zod.date()).readonly();
        const dateMap = new Map([['now', new Date(0)]]);
        const parsedReadonly = readonlyStringDateMap.parse(dateMap);
        assert(parsedReadonly instanceof Map, 'readonly parsed value should still be a Map');
        assert(parsedReadonly.get('now') instanceof Date, 'value should be a Date instance');

        done();
    });
});