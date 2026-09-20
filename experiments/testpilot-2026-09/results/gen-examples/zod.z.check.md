# passing C: zod.z.check

Prompt ID 209; test test_209.js.

## Prompt (verbatim)

````text
Your task is to write a test for the following function
```
zod.z.check(fn)
```

This function is defined as follows:
```
function check(fn) {
    const ch = new core.$ZodCheck({
        check: "custom",
        // ...util.normalizeParams(params),
    });
    ch._zod.check = fn;
    return ch;
}
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.check', function(done) {
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
    it('test zod.z.check', function(done) {
        // a simple custom validation function
        const fn = function() { return 42; };
        // invoke the zod.z.check helper
        const result = zod.z.check(fn);
        // result should be an object
        assert.ok(result);
        // the custom function should be stored on the internal _zod.check property
        assert.strictEqual(result._zod.check, fn);
        // calling the stored function should behave as expected
        assert.strictEqual(result._zod.check(), 42);
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
    it('test zod.z.check', function(done) {
        // a simple custom validation function
        const fn = function() { return 42; };
        // invoke the zod.z.check helper
        const result = zod.z.check(fn);
        // result should be an object
        assert.ok(result);
        // the custom function should be stored on the internal _zod.check property
        assert.strictEqual(result._zod.check, fn);
        // calling the stored function should behave as expected
        assert.strictEqual(result._zod.check(), 42);
        done();
    });
});
````

## Outcome

```json
{
  "testName": "test_209.js",
  "api": "zod.z.check",
  "testFile": "test_209.js",
  "promptIds": [
    209
  ],
  "status": "PASSED",
  "err": {},
  "coveredStatements": [
    "index.js@1:0-1:32"
  ],
  "duration": 424.5080840000883
}
```
