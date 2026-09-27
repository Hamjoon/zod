// mocha test – fixed
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

// Zod exposes the `z` namespace (lower‑case) that contains the schema builders.
// We'll use that for a clearer API.
const { z } = zod;

describe('test zod', function () {
  it('test zod.z.keyof', function (done) {
    // 1️⃣ define a simple object schema
    const Dog = z.object({
      name: z.string(),
      age: z.number(),
    });

    // -------------------------------------------------
    // 1️⃣ use the instance method .keyof()
    // -------------------------------------------------
    const keySchemaInst = Dog.keyof(); // ZodEnum<["name","age"]>

    // ensure we got a ZodEnum instance
    assert(
      keySchemaInst instanceof zod.ZodEnum,
      'Dog.keyof() should return a ZodEnum'
    );

    // the enum values should match the object keys (order is not guaranteed)
    // Access the internal definition safely – it may be undefined in some Zod versions,
    // so we guard against that.
    const instValues = (keySchemaInst._def && keySchemaInst._def.values) || [];
    assert.deepStrictEqual(
      [...instValues].sort(),
      ['name', 'age'].sort(),
      'Dog.keyof() enum values are incorrect'
    );

    // parsing a valid key should succeed
    assert.strictEqual(keySchemaInst.parse('name'), 'name');

    // -------------------------------------------------
    // 2️⃣ use the static helper (if available)
    // -------------------------------------------------
    // In recent Zod releases the static helper lives on the `z` namespace:
    //   z.keyof(schema)
    // Older releases didn't have it, so we fall back to the instance method.
    let keySchemaStatic;
    if (typeof z.keyof === 'function') {
      // Newer Zod – use the static helper
      keySchemaStatic = z.keyof(Dog);
    } else {
      // Older Zod – mimic the static helper with the instance method
      keySchemaStatic = Dog.keyof();
    }

    // ensure we got a ZodEnum instance
    assert(
      keySchemaStatic instanceof zod.ZodEnum,
      'z.keyof should return a ZodEnum'
    );

    // the enum values should match the object keys (order is not guaranteed)
    const staticValues = (keySchemaStatic._def && keySchemaStatic._def.values) || [];
    assert.deepStrictEqual(
      [...staticValues].sort(),
      ['name', 'age'].sort(),
      'z.keyof enum values are incorrect'
    );

    // parsing a valid key should also succeed
    assert.strictEqual(keySchemaStatic.parse('age'), 'age');

    done();
  });
});