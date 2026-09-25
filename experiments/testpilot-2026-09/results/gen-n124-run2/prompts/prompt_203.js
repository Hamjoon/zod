Your task is to write a test for the following function
```
zod.z.int(params)
```

You may use the following examples to guide your implementation:
```
// usage #1
z.number().gt(5);z.number().gte(5); // alias .min(5)z.number().lt(5);z.number().lte(5); // alias .max(5)z.number().int(); // value must be an integerz.number().positive(); //     > 0z.number().nonnegative(); //  >= 0z.number().negative(); //     < 0z.number().nonpositive(); //  <= 0z.number().multipleOf(5); // Evenly divisible by 5. Alias .step(5)z.number().finite(); // value must be finite, not Infinity or -Infinityz.number().safe(); // value must be between Number.MIN_SAFE_INTEGER and Number.MAX_SAFE_INTEGER
// usage #2
z.object({ a: z.string() }).and(z.object({ b: z.number() })); // ❌// use z.intersectionz.intersection(z.object({ a: z.string() }), z.object({ b: z.number() })); // ✅// or .extend() when possiblez.object({ a: z.string() }).extend(z.object({ b: z.number() })); // ✅``` */}## `z.number()`### no infinite values`POSITIVE_INFINITY` and `NEGATIVE_INFINITY` are no longer considered valid values for `z.number()`.### `.safe()` no longer accepts floatsIn Zod 3, `z.number().safe()` is deprecated. It now behaves identically to `.int()` (see below). Importantly, that means it no longer accepts floats.### `.int()` accepts safe integers only
// usage #3
z.int();     // restricts to safe integer rangez.int32();   // restrict to int32 range
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.int', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```