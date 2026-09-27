let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.tuple', function(done) {
        // 1️⃣ Fixed‑length tuple
        const athleteSchema = zod.tuple([
            zod.string(),                     // name
            zod.number(),                     // jersey number
            zod.object({ pointsScored: zod.number() }) // statistics
        ]);

        // valid value
        const validAthlete = ["Jordan", 23, { pointsScored: 30 }];
        const parsedAthlete = athleteSchema.parse(validAthlete);
        assert.deepStrictEqual(parsedAthlete, validAthlete);

        // invalid value – wrong type for jersey number
        const invalidAthlete = ["Jordan", "23", { pointsScored: 30 }];
        // Adjusted regex to match Zod's error message (lower‑case "expected")
        assert.throws(() => athleteSchema.parse(invalidAthlete), /expected number/);

        // 2️⃣ Tuple with a rest element
        const restTupleSchema = zod.tuple([zod.string()], zod.string()); // [string, ...string[]]

        // valid values
        const restValid1 = ["only"];
        const restValid2 = ["first", "second", "third"];
        assert.deepStrictEqual(restTupleSchema.parse(restValid1), restValid1);
        assert.deepStrictEqual(restTupleSchema.parse(restValid2), restValid2);

        // invalid – non‑string in the rest part
        const restInvalid = ["first", 2];
        assert.throws(() => restTupleSchema.parse(restInvalid), /expected string/);

        // 3️⃣ Readonly tuple
        const readonlyTupleSchema = zod.tuple([zod.string(), zod.number()]).readonly();

        const readonlyValue = readonlyTupleSchema.parse(["foo", 42]);
        // The result should be frozen (readonly) – attempts to mutate should throw in strict mode
        assert(Object.isFrozen(readonlyValue), "Resulting tuple should be frozen");

        // Trying to push should throw a TypeError
        assert.throws(() => {
            // @ts-ignore – we deliberately mutate to test runtime behaviour
            readonlyValue.push("bar");
        }, TypeError);

        done();
    });
});