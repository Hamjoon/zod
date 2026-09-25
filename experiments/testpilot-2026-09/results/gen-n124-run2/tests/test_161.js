let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
  it('test zod.z.ipv6', function (done) {
    // Get the Zod IPv6 schema
    const schema = zod.z.ipv6();

    // Pull out only the JSON‑schema‑like description that the test expects
    const result = {
      type: schema._def.type,
      format: schema._def.format,
    };

    assert.deepStrictEqual(result, { type: 'string', format: 'ipv6' });
    done();
  });
});