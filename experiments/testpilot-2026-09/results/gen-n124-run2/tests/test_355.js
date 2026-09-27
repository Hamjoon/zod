let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.tuple', function(done) {
        // ---- 1. Basic tuple without rest ----
        const athleteSchema = zod.tuple([
            zod.string(),
            zod.number(),
            zod.object({ pointsScored: zod.number() })
        ]);

        // valid data should parse unchanged
        const validAthlete = ['Alice', 23, { pointsScored: 30 }];
        assert.deepStrictEqual(athleteSchema.parse(validAthlete), validAthlete);

        // invalid data (wrong type for the second element) should throw
        assert.throws(() => athleteSchema.parse(['Alice', '23', { pointsScored: 30 }]));

        // ---- 2. Tuple with a rest element (variadic tuple) ----
        // Equivalent to [string, ...string[]]
        const restSchema = zod.tuple([zod.string()], zod.string());

        // Various valid lengths
        assert.deepStrictEqual(restSchema.parse(['a', 'b', 'c']), ['a', 'b', 'c']);
        assert.deepStrictEqual(restSchema.parse(['onlyOne']), ['onlyOne']);

        // Missing required first element should fail
        assert.throws(() => restSchema.parse([]));

        // Non‑string element in the rest should fail
        assert.throws(() => restSchema.parse(['a', 1]));

        // ---- 3. Readonly tuple ----
        const readonlySchema = zod.tuple([zod.string(), zod.number()]).readonly();

        // Parsing works the same as a normal tuple
        const readonlyResult = readonlySchema.parse(['foo', 42]);
        assert.deepStrictEqual(readonlyResult, ['foo', 42]);

        // The result is typed as ReadonlyArray at compile time; at runtime we just ensure it parses.
        // (Zod does not freeze the array, so we only verify successful parsing.)

        done();
    });
});