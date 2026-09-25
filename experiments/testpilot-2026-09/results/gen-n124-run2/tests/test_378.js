let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.map', function (done) {
    // create a map schema with string keys and number values
    const mapSchema = zod.map(zod.string(), zod.number());

    // a valid map should parse correctly
    const validMap = new Map([
      ['one', 1],
      ['two', 2],
    ]);
    const parsed = mapSchema.parse(validMap);
    assert.ok(parsed instanceof Map);
    assert.strictEqual(parsed.get('one'), 1);
    assert.strictEqual(parsed.get('two'), 2);
    assert.deepStrictEqual([...parsed.entries()], [...validMap.entries()]);

    // an invalid map (wrong value type) should throw
    const invalidMap = new Map([['bad', 'not a number']]);
    // Zod's error message contains “expected number” (case‑insensitive)
    assert.throws(() => mapSchema.parse(invalidMap), /expected number/i);

    // readonly version of the schema should produce an immutable map
    const readonlySchema = mapSchema.readonly();
    const roParsed = readonlySchema.parse(validMap);
    assert.ok(roParsed instanceof Map);
    // Zod freezes the result for readonly schemas, so mutation should fail
    assert.throws(() => {
      // @ts-ignore – we deliberately try to mutate the frozen map
      roParsed.set('three', 3);
    }, TypeError);

    done();
  });
});