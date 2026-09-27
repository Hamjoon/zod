Your task is to write a test for the following function
```
zod.z.lte(value, params)
```

You may use the following examples to guide your implementation:
```
// usage #1
z.number().gt(5);z.number().gte(5); // alias .min(5)z.number().lt(5);z.number().lte(5); // alias .max(5)z.number().int(); // value must be an integerz.number().positive(); //     > 0z.number().nonnegative(); //  >= 0z.number().negative(); //     < 0z.number().nonpositive(); //  <= 0z.number().multipleOf(5); // Evenly divisible by 5. Alias .step(5)z.number().finite(); // value must be finite, not Infinity or -Infinityz.number().safe(); // value must be between Number.MIN_SAFE_INTEGER and Number.MAX_SAFE_INTEGER
// usage #2
z.bigint().gt(5n);z.bigint().gte(5n); // alias `.min(5n)`z.bigint().lt(5n);z.bigint().lte(5n); // alias `.max(5n)`z.bigint().positive(); // > 0nz.bigint().nonnegative(); // >= 0nz.bigint().negative(); // < 0nz.bigint().nonpositive(); // <= 0nz.bigint().multipleOf(5n); // Evenly divisible by 5n.
// usage #3
import * as z from "zod/mini";// custom checksz.refine();// first-class checksz.lt(value);z.lte(value); // alias: z.maximum()z.gt(value);z.gte(value); // alias: z.minimum()z.positive();z.negative();z.nonpositive();z.nonnegative();z.multipleOf(value);z.maxSize(value);z.minSize(value);z.size(value);z.maxLength(value);z.minLength(value);
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.lte', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```