The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nullable', function(done) {
        // Create a nullable string schema using the function under test
        const nullableString = zod.z.nullable(zod.z.string());

        // The schema should accept null and return it unchanged
        assert.strictEqual(nullableString.parse(null), null, 'null should be parsed as null');

        // The schema should accept a valid string and return it unchanged
        const testStr = 'hello world';
        assert.strictEqual(nullableString.parse(testStr), testStr, 'valid string should be parsed unchanged');

        // The schema should reject values that are not null or the inner type
        assert.throws(() => nullableString.parse(123), /Invalid/, 'non‑string, non‑null should throw');

        // Verify that the internal representation contains the correct inner type
        // (Zod exposes the inner type via ._def.innerType in recent versions)
        assert.strictEqual(nullableString._def.innerType, zod.z.string(), 'inner type should be string');

        done();
    });
});
``` 
failed with the following error message:
```
inner type should be string

... Skipped lines
ZodString {
  '~standard': {
    validate: [Function: validate],
    vendor: 'zod',
    version: 1
  },
  and: [Function (anonymous)],
  array: [Function (anonymous)],
  base64: [Function (anonymous)],
  base64url: [Function (anonymous)],
  brand: [Function (anonymous)],
  catch: [Function (anonymous)],
  check: [Function (anonymous)],
  cidrv4: [Function (anonymous)],
  cidrv6: [Function (anonymous)],
  clone: [Function (anonymous)],
  cuid2: [Function (anonymous)],
  cuid: [Function (anonymous)],
  date: [Function (anonymous)],
  datetime: [Function (anonymous)],
  def: {
    type: 'string'
  },
  default: [Function (anonymous)],
  describe: [Function (anonymous)],
  duration: [Function (anonymous)],
  e164: [Function (anonymous)],
  email: [Function (anonymous)],
  emoji: [Function (anonymous)],
  endsWith: [Function (anonymous)],
  format: null,
  guid: [Function (anonymous)],
  includes: [Function (anonymous)],
  ipv4: [Function (anonymous)],
  ipv6: [Function (anonymous)],
  isNullable: [Function (anonymous)],
  isOptional: [Function (anonymous)],
  jwt: [Function (anonymous)],
  ksuid: [Function (anonymous)],
  length: [Function (anonymous)],
  lowercase: [Function (anonymous)],
  max: [Function (anonymous)],
  maxLength: null,
  meta: [Function (anonymous)],
  min: [Function (anonymous)],
  minLength: null,
  nanoid: [Function (anonymous)],
  nonempty: [Function (anonymous)],
  nonoptional: [Function (anonymous)],
  normalize: [Function (anonymous)],
...}
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.