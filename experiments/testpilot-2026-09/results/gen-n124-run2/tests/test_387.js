let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.enum & z.nativeEnum', function (done) {
    // 1️⃣ Enum created from an array of strings
    const Color = zod.z.enum(['Red', 'Green']);
    // parsing a valid enum value should succeed and return the same value
    assert.strictEqual(Color.parse('Red'), 'Red');
    // parsing an invalid value should throw a ZodError
    // Zod's error message for enums is "Invalid option: expected one of ..."
    assert.throws(() => Color.parse('Blue'), /Invalid option/);
    // internal definition should contain entries mapping each string to itself
    assert.deepStrictEqual(Color._def.entries, { Red: 'Red', Green: 'Green' });

    // 2️⃣ Enum created from an object (value → value mapping)
    // For object‑based enums Zod provides `nativeEnum`
    const Status = zod.z.nativeEnum({ ok: 0, fail: 1 });
    // valid values are accepted
    assert.strictEqual(Status.parse(0), 0);
    assert.strictEqual(Status.parse(1), 1);
    // an unknown value should throw
    assert.throws(() => Status.parse(2), /Invalid option/);
    // internal definition should be exactly the object that was supplied
    // `nativeEnum` stores the original object in `_def.values`
    assert.deepStrictEqual(Status._def.values, { ok: 0, fail: 1 });

    done();
  });
});