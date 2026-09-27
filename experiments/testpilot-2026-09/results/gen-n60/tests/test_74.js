let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.tuple', function (done) {
    // ---------- Fixed‑length tuple ----------
    const athleteSchema = zod.tuple([
      zod.string(),
      zod.number(),
      zod.object({ pointsScored: zod.number() })
    ]);
    const athlete = athleteSchema.parse(['Usain', 9, { pointsScored: 100 }]);
    assert.deepStrictEqual(athlete, ['Usain', 9, { pointsScored: 100 }]);

    // ---------- Tuple with a rest element ----------
    const restSchema = zod.tuple([zod.string()], zod.string());
    const restValue = restSchema.parse(['first', 'second', 'third']);
    assert.deepStrictEqual(restValue, ['first', 'second', 'third']);

    // Invalid data for the rest‑tuple (second element must be a string)
    // Zod throws a ZodError whose message contains "expected string".
    // Adjust the regex to match the actual error message.
    assert.throws(
      () => restSchema.parse(['onlyOne', 2]),
      /expected string/i
    );

    // ---------- Readonly tuple ----------
    const readonlySchema = zod.tuple([zod.string(), zod.number()]).readonly();
    const readonlyValue = readonlySchema.parse(['hello', 42]);
    assert.deepStrictEqual(readonlyValue, ['hello', 42]);

    // The runtime value is still an array; the readonly aspect is a TypeScript type only.
    // We can at least verify that the schema is indeed a ZodTuple.
    assert.strictEqual(readonlySchema._def.typeName, 'ZodTuple');

    done();
  });
});