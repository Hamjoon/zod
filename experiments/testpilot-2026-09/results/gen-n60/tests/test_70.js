let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod'); // use the proper Zod import

describe('test zod', function () {
  it('test zod.z.tuple', function (done) {
    // 1. Simple tuple without rest
    const simpleTuple = z.tuple([z.string(), z.number()]);
    // valid case
    assert.deepStrictEqual(simpleTuple.parse(['hello', 123]), ['hello', 123]);
    // invalid case – missing the second element
    assert.throws(() => simpleTuple.parse(['hello']), /Expected number/);

    // 2. Tuple with a rest element (rest is a ZodType)
    // .rest adds a variadic part that can appear zero or more times
    const restTuple = z.tuple([z.string()]).rest(z.number());
    // valid with only the required element
    assert.deepStrictEqual(restTuple.parse(['onlyString']), ['onlyString']);
    // valid with additional rest elements
    assert.deepStrictEqual(restTuple.parse(['first', 1, 2, 3]), ['first', 1, 2, 3]);
    // invalid – rest element of wrong type
    assert.throws(() => restTuple.parse(['first', 'notNumber']), /Expected number/);

    // 3. Tuple with custom params (no rest)
    // Zod uses .describe() to set a description; the description is exposed via .description
    const paramsTuple = z.tuple([z.boolean()]).describe('boolean tuple');
    // params should not affect parsing
    assert.deepStrictEqual(paramsTuple.parse([true]), [true]);
    // ensure the description is stored (Zod exposes it via .description)
    assert.strictEqual(paramsTuple.description, 'boolean tuple');

    done();
  });
});