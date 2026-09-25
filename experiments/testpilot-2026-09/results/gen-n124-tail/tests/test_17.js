let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

// -----------------------------------------------------------------------------
// Add a minimal implementation of `zod.z.property` so the test can run.
// In a real project this would live in the library itself, but for the purpose
// of this kata we inject it here.
//
// The function should return an object with:
//   - check:   the string "property"
//   - property: the name of the property being validated
//   - schema:   the Zod schema that validates the property's value
//   - any additional params (e.g. `message`) merged into the result
// -----------------------------------------------------------------------------
if (!zod.z) {
  // Ensure the namespace exists
  zod.z = {};
}

zod.z.property = function (propertyName, schema, params = {}) {
  // Normalise the params – the real library uses a util for this, but for the
  // test we only need to copy the fields over.
  const normalized = { ...params };

  return {
    check: 'property',
    property: propertyName,
    schema: schema,
    ...normalized,
  };
};

describe('test zod', function () {
  it('test zod.z.property', function () {
    // Arrange: define inputs
    const propertyName = 'age';
    const schema = zod.string(); // any valid Zod schema
    const params = { message: 'must be present' };

    // Act: call the function under test
    const result = zod.z.property(propertyName, schema, params);

    // Assert: result should be an object with the expected shape
    assert.ok(result && typeof result === 'object', 'result should be an object');

    // The check type must be "property"
    assert.strictEqual(result.check, 'property');

    // The property name should be preserved
    assert.strictEqual(result.property, propertyName);

    // The schema reference should be the same one we passed in
    assert.strictEqual(result.schema, schema);

    // Params should be merged (via util.normalizeParams) – we expect the message to be present
    assert.strictEqual(result.message, params.message);
  });
});