Your task is to write a test for the following function
```
zod.z.minLength(minimum, params)
```

This function is defined as follows:
```
function _minLength(minimum, params) {
    return new checks.$ZodCheckMinLength({
        check: "min_length",
        ...util.normalizeParams(params),
        minimum,
    });
}
```

You may use the following examples to guide your implementation:
```
// usage #1
z.string().check(z.maxLength(5));z.string().check(z.minLength(5));z.string().check(z.length(5));z.string().check(z.regex(/^[a-z]+$/));z.string().check(z.startsWith("aaa"));z.string().check(z.endsWith("zzz"));z.string().check(z.includes("---"));z.string().check(z.uppercase());z.string().check(z.lowercase());
// usage #2
// regular Zodz.string().min(5).max(10).trim()// Zod Miniz.string().check(z.minLength(5), z.maxLength(10), z.trim());
// usage #3
import * as z from "zod/mini";// custom checksz.refine();// first-class checksz.lt(value);z.lte(value); // alias: z.maximum()z.gt(value);z.gte(value); // alias: z.minimum()z.positive();z.negative();z.nonpositive();z.nonnegative();z.multipleOf(value);z.maxSize(value);z.minSize(value);z.size(value);z.maxLength(value);z.minLength(value);
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.minLength', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```