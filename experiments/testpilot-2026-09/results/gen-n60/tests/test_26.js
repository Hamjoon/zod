let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.nullish', function (done) {
    const inner = zod.z.string();
    const schema = zod.z.nullish(inner);

    // valid values
    assert.strictEqual(schema.parse('hello'), 'hello');
    assert.strictEqual(schema.parse(null), null);
    assert.strictEqual(schema.parse(undefined), undefined);

    // invalid value should throw – match the actual Zod error message
    // Zod throws a ZodError whose message contains "expected string"
    assert.throws(() => schema.parse(123), /expected string/);

    done();
  });
});