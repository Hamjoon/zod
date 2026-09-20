const { describe, it } = require('mocha');
const assert = require('assert');
const { z, ZodError } = require('zod');

describe('test zod', function () {
  it('test z.never()', function (done) {
    // Create a never schema
    const schema = z.never();

    // The schema should reject any value – parse should throw a ZodError
    assert.throws(() => schema.parse(undefined), ZodError);
    assert.throws(() => schema.parse(null), ZodError);
    assert.throws(() => schema.parse(0), ZodError);
    assert.throws(() => schema.parse('any string'), ZodError);
    assert.throws(() => schema.parse({}), ZodError);
    assert.throws(() => schema.parse([]), ZodError);

    // safeParse should return a failure result
    const safeResult = schema.safeParse('whatever');
    assert.strictEqual(safeResult.success, false);

    // The error message should mention that the value is never allowed
    // ZodError stores issues in the `issues` array (not `errors` in recent versions)
    const firstIssue = safeResult.error.issues[0];
    assert.ok(firstIssue.message.includes('Never'));

    done();
  });
});