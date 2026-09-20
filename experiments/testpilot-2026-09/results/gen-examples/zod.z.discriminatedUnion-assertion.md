# failing assertion: zod.z.discriminatedUnion

Prompt ID 0; test test_0.js.

## Prompt (verbatim)

````text
Your task is to write a test for the following function
```
zod.z.discriminatedUnion(discriminator, options, params)
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
        // Define two discriminated object schemas
        const schemaA = zod.z.object({
            type: zod.z.literal('a'),
            a: zod.z.string()
        });
        const schemaB = zod.z.object({
            type: zod.z.literal('b'),
            b: zod.z.number()
        });

        // Create the discriminated union schema
        const unionSchema = zod.z.discriminatedUnion('type', [schemaA, schemaB]);

        // Valid cases
        const parsedA = unionSchema.parse({ type: 'a', a: 'hello' });
        assert.deepStrictEqual(parsedA, { type: 'a', a: 'hello' });

        const parsedB = unionSchema.parse({ type: 'b', b: 42 });
        assert.deepStrictEqual(parsedB, { type: 'b', b: 42 });

        // Invalid cases
        assert.throws(() => {
            unionSchema.parse({ type: 'a', a: 123 }); // a should be string
        }, /Expected string/);

        assert.throws(() => {
            unionSchema.parse({ type: 'c', c: true }); // unknown discriminator
        }, /Invalid discriminator value/);

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
        // Define two discriminated object schemas
        const schemaA = zod.z.object({
            type: zod.z.literal('a'),
            a: zod.z.string()
        });
        const schemaB = zod.z.object({
            type: zod.z.literal('b'),
            b: zod.z.number()
        });

        // Create the discriminated union schema
        const unionSchema = zod.z.discriminatedUnion('type', [schemaA, schemaB]);

        // Valid cases
        const parsedA = unionSchema.parse({ type: 'a', a: 'hello' });
        assert.deepStrictEqual(parsedA, { type: 'a', a: 'hello' });

        const parsedB = unionSchema.parse({ type: 'b', b: 42 });
        assert.deepStrictEqual(parsedB, { type: 'b', b: 42 });

        // Invalid cases
        assert.throws(() => {
            unionSchema.parse({ type: 'a', a: 123 }); // a should be string
        }, /Expected string/);

        assert.throws(() => {
            unionSchema.parse({ type: 'c', c: true }); // unknown discriminator
        }, /Invalid discriminator value/);

        done();
    });
});
````

## Outcome

```json
{
  "testName": "test_0.js",
  "api": "zod.z.discriminatedUnion",
  "testFile": "test_0.js",
  "promptIds": [
    0
  ],
  "status": "FAILED",
  "err": {
    "stack": "AssertionError [ERR_ASSERTION]: The input did not match the regular expression /Expected string/. Input:\n\n'[\\n' +\n  '  {\\n' +\n  '    \"expected\": \"string\",\\n' +\n  '    \"code\": \"invalid_type\",\\n' +\n  '    \"path\": [\\n' +\n  '      \"a\"\\n' +\n  '    ],\\n' +\n  '    \"message\": \"Invalid input: expected string, received number\"\\n' +\n  '  }\\n' +\n  ']'\n\n    at Context.<anonymous> (/work/zod/experiments/testpilot-2026-09/wrappers/zod/test-wHXaMd/test_0.js:28:16)\n    at callFnAsync (/work/testpilot2/node_modules/mocha/lib/runnable.js:394:21)\n    at Runnable.run (/work/testpilot2/node_modules/mocha/lib/runnable.js:338:7)\n    at Runner.runTest (/work/testpilot2/node_modules/mocha/lib/runner.js:666:10)\n    at /work/testpilot2/node_modules/mocha/lib/runner.js:789:12\n    at next (/work/testpilot2/node_modules/mocha/lib/runner.js:581:14)\n    at /work/testpilot2/node_modules/mocha/lib/runner.js:591:7\n    at next (/work/testpilot2/node_modules/mocha/lib/runner.js:474:14)\n    at Immediate._onImmediate (/work/testpilot2/node_modules/mocha/lib/runner.js:559:5)\n    at process.processImmediate (node:internal/timers:484:21)",
    "message": "The input did not match the regular expression /Expected string/. Input:\n\n'[\\n' +\n  '  {\\n' +\n  '    \"expected\": \"string\",\\n' +\n  '    \"code\": \"invalid_type\",\\n' +\n  '    \"path\": [\\n' +\n  '      \"a\"\\n' +\n  '    ],\\n' +\n  '    \"message\": \"Invalid input: expected string, received number\"\\n' +\n  '  }\\n' +\n  ']'\n",
    "generatedMessage": true,
    "name": "AssertionError",
    "code": "ERR_ASSERTION",
    "actual": {
      "name": "ZodError",
      "message": "[\n  {\n    \"expected\": \"string\",\n    \"code\": \"invalid_type\",\n    \"path\": [\n      \"a\"\n    ],\n    \"message\": \"Invalid input: expected string, received number\"\n  }\n]"
    },
    "expected": {},
    "operator": "throws",
    "diff": "simple"
  },
  "coveredStatements": [],
  "duration": 426.2554999999993
}
```
