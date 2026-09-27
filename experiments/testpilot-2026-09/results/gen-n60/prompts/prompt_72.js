The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.tuple', function(done) {
        // ----------- Tuple without a rest element -----------
        const basic = zod.tuple([zod.string(), zod.number()]);

        // internal definition checks
        assert.strictEqual(basic._def.type, 'tuple');
        assert.deepStrictEqual(basic._def.items.map(i => i._def.type), ['string', 'number']);
        assert.strictEqual(basic._def.rest, null);

        // parsing valid data
        const parsedBasic = basic.parse(['hello', 42]);
        assert.deepStrictEqual(parsedBasic, ['hello', 42]);

        // parsing invalid data should throw a ZodError
        assert.throws(() => basic.parse(['hello', 'not a number']), zod.ZodError);

        // ----------- Tuple with a rest element -----------
        const withRest = zod.tuple([zod.string()], zod.number());

        // rest schema should be stored correctly
        assert.strictEqual(withRest._def.rest, zod.number());

        // parsing with extra rest elements works
        const parsedRest = withRest.parse(['first', 1, 2, 3]);
        assert.deepStrictEqual(parsedRest, ['first', 1, 2, 3]);

        // parsing fails when a rest element does not match the rest schema
        assert.throws(() => withRest.parse(['first', 1, 'bad']), zod.ZodError);

        // ----------- Readonly wrapper -----------
        const readonlyTuple = withRest.readonly();
        assert.strictEqual(readonlyTuple._def.type, 'readonly');
        assert.strictEqual(readonlyTuple._def.inner, withRest);

        done();
    });
});
``` 
failed with the following error message:
```
Values have same structure but are not reference-equal:

... Skipped lines
ZodNumber {
  '~standard': {
    validate: [Function: validate],
    vendor: 'zod',
    version: 1
  },
  and: [Function (anonymous)],
  array: [Function (anonymous)],
  brand: [Function (anonymous)],
  catch: [Function (anonymous)],
  check: [Function (anonymous)],
  clone: [Function (anonymous)],
  def: {
    checks: [],
    type: 'number'
  },
  default: [Function (anonymous)],
  describe: [Function (anonymous)],
  finite: [Function (anonymous)],
  format: null,
  gt: [Function (anonymous)],
  gte: [Function (anonymous)],
  int: [Function (anonymous)],
  isFinite: true,
  isInt: false,
  isNullable: [Function (anonymous)],
  isOptional: [Function (anonymous)],
  lt: [Function (anonymous)],
  lte: [Function (anonymous)],
  max: [Function (anonymous)],
  maxValue: Infinity,
  meta: [Function (anonymous)],
  min: [Function (anonymous)],
  minValue: -Infinity,
  multipleOf: [Function (anonymous)],
  negative: [Function (anonymous)],
  nonnegative: [Function (anonymous)],
  nonoptional: [Function (anonymous)],
  nonpositive: [Function (anonymous)],
  nullable: [Function (anonymous)],
  nullish: [Function (anonymous)],
  optional: [Function (anonymous)],
  or: [Function (anonymous)],
  overwrite: [Function (anonymous)],
  parse: [Function (anonymous)],
  parseAsync: [AsyncFunction (anonymous)],
  pipe: [Function (anonymous)],
  positive: [Function (anonymous)],
  prefault: [Function (anonymous)],
  readonly: [Function (anonymous)],
...}
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.