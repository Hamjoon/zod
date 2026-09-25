let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.coerce.number', function (done) {
    // basic coercion: number stays a number
    const schema = zod.z.coerce.number();
    const resultNumber = schema.safeParse(123);
    assert.strictEqual(resultNumber.success, true);
    assert.strictEqual(resultNumber.data, 123);

    // coercion: numeric string becomes a number
    const resultString = schema.safeParse('456');
    assert.strictEqual(resultString.success, true);
    assert.strictEqual(resultString.data, 456);

    // invalid coercion: non‑numeric string should fail
    const resultInvalid = schema.safeParse('not-a-number');
    assert.strictEqual(resultInvalid.success, false);

    // custom error message via params
    const schemaWithMsg = zod.z.coerce.number({ invalid_type_error: 'Not a number' });
    const resultCustomMsg = schemaWithMsg.safeParse('abc');
    assert.strictEqual(resultCustomMsg.success, false);

    // ensure the custom message appears in the error
    // In recent Zod versions the array of errors is called `issues`
    const hasCustomMsg = resultCustomMsg.error.issues.some(
      (e) => e.message === 'Not a number'
    );
    assert.strictEqual(hasCustomMsg, true);

    done();
  });
});