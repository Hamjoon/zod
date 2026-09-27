Your task is to write a test for the following function
```
zod.z.uppercase(params)
```

This function is defined as follows:
```
function _uppercase(params) {
    return new checks.$ZodCheckUpperCase({
        check: "string_format",
        format: "uppercase",
        ...util.normalizeParams(params),
    });
}
```

You may use the following examples to guide your implementation:
```
// usage #1
z.lt(value);z.lte(value); // alias: z.maximum()z.gt(value);z.gte(value); // alias: z.minimum()z.positive();z.negative();z.nonpositive();z.nonnegative();z.multipleOf(value);z.maxSize(value);z.minSize(value);z.size(value);z.maxLength(value);z.minLength(value);z.length(value);z.regex(regex);z.lowercase();z.uppercase();z.includes(value);z.startsWith(value);
// usage #2
import * as z from "zod/mini";// custom checksz.refine();// first-class checksz.lt(value);z.lte(value); // alias: z.maximum()z.gt(value);z.gte(value); // alias: z.minimum()z.positive();z.negative();z.nonpositive();z.nonnegative();z.multipleOf(value);z.maxSize(value);z.minSize(value);z.size(value);z.maxLength(value);z.minLength(value);
// usage #3
z.string().max(5);z.string().min(5);z.string().length(5);z.string().regex(/^[a-z]+$/);z.string().startsWith("aaa");z.string().endsWith("zzz");z.string().includes("---");z.string().uppercase();z.string().lowercase();
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uppercase', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```