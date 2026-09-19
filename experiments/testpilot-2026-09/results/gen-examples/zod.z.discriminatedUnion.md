# passing S: zod.z.discriminatedUnion

Prompt ID 1; test test_1.js.

## Prompt (verbatim)

````text
Your task is to write a test for the following function
```
zod.z.discriminatedUnion(discriminator, options, params)
```

This function is defined as follows:
```
function discriminatedUnion(discriminator, options, params) {
    // const [options, params] = args;
    return new exports.ZodDiscriminatedUnion({
        type: "union",
        options,
        discriminator,
        ...index_js_1.util.normalizeParams(params),
    });
}
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```
````

## Completion (verbatim)

````text
```javascript
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
        // Create a discriminated union with discriminator key "type"
        const Union = zod.z.discriminatedUnion('type', [
            zod.z.object({
                type: zod.z.literal('foo'),
                foo: zod.z.string(),
            }),
            zod.z.object({
                type: zod.z.literal('bar'),
                bar: zod.z.number(),
            }),
        ]);

        // ----- Valid parses -------------------------------------------------
        // Should parse a "foo" variant correctly
        assert.doesNotThrow(() => {
            const parsed = Union.parse({ type: 'foo', foo: 'hello' });
            assert.deepStrictEqual(parsed, { type: 'foo', foo: 'hello' });
        });

        // Should parse a "bar" variant correctly
        assert.doesNotThrow(() => {
            const parsed = Union.parse({ type: 'bar', bar: 123 });
            assert.deepStrictEqual(parsed, { type: 'bar', bar: 123 });
        });

        // ----- Invalid parses ------------------------------------------------
        // Unknown discriminator value should throw a ZodError
        assert.throws(
            () => Union.parse({ type: 'baz', baz: true }),
            err => err instanceof zod.ZodError
        );

        // Missing discriminator key should also throw a ZodError
        assert.throws(
            () => Union.parse({ foo: 'hello' }),
            err => err instanceof zod.ZodError
        );

        done();
    });
});
```
````

## Assembled test (verbatim)

````javascript
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
        // Create a discriminated union with discriminator key "type"
        const Union = zod.z.discriminatedUnion('type', [
            zod.z.object({
                type: zod.z.literal('foo'),
                foo: zod.z.string(),
            }),
            zod.z.object({
                type: zod.z.literal('bar'),
                bar: zod.z.number(),
            }),
        ]);

        // ----- Valid parses -------------------------------------------------
        // Should parse a "foo" variant correctly
        assert.doesNotThrow(() => {
            const parsed = Union.parse({ type: 'foo', foo: 'hello' });
            assert.deepStrictEqual(parsed, { type: 'foo', foo: 'hello' });
        });

        // Should parse a "bar" variant correctly
        assert.doesNotThrow(() => {
            const parsed = Union.parse({ type: 'bar', bar: 123 });
            assert.deepStrictEqual(parsed, { type: 'bar', bar: 123 });
        });

        // ----- Invalid parses ------------------------------------------------
        // Unknown discriminator value should throw a ZodError
        assert.throws(
            () => Union.parse({ type: 'baz', baz: true }),
            err => err instanceof zod.ZodError
        );

        // Missing discriminator key should also throw a ZodError
        assert.throws(
            () => Union.parse({ foo: 'hello' }),
            err => err instanceof zod.ZodError
        );

        done();
    });
});
````

## Outcome

```json
{
  "testName": "test_1.js",
  "api": "zod.z.discriminatedUnion",
  "testFile": "test_1.js",
  "promptIds": [
    1
  ],
  "status": "PASSED",
  "err": {},
  "coveredStatements": [
    "index.js@1:0-1:32"
  ],
  "duration": 453.80966700000135
}
```
