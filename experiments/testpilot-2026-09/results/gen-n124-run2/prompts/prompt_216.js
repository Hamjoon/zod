Your task is to write a test for the following function
```
zod.z.float64(params)
```

You may use the following examples to guide your implementation:
```
// usage #1
// numberz.number(); // => { type: "number" }z.float32(); // => { type: "number", exclusiveMinimum: ..., exclusiveMaximum: ... }z.float64(); // => { type: "number", exclusiveMinimum: ..., exclusiveMaximum: ... }// integerz.int(); // => { type: "integer" }z.int32(); // => { type: "integer", exclusiveMinimum: ..., exclusiveMaximum: ... }
// usage #2
z.int();      // [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],z.float32();  // [-3.4028234663852886e38, 3.4028234663852886e38]z.float64();  // [-1.7976931348623157e308, 1.7976931348623157e308]z.int32();    // [-2147483648, 2147483647]z.uint32();   // [0, 4294967295]
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.float64', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```