Your task is to write a test for the following function
```
zod.z.maxSize(maximum, params)
```

This function is defined as follows:
```
function _maxSize(maximum, params) {
    return new checks.$ZodCheckMaxSize({
        check: "max_size",
        ...util.normalizeParams(params),
        maximum,
    });
}
```

You may use the following examples to guide your implementation:
```
// usage #1
z.set(z.string()).check(z.minSize(5)); // must contain 5 or more itemsz.set(z.string()).check(z.maxSize(5)); // must contain 5 or fewer itemsz.set(z.string()).check(z.size(5)); // must contain 5 items exactly
// usage #2
const fileSchema = z.file();fileSchema.check(  z.minSize(10_000), // minimum .size (bytes)  z.maxSize(1_000_000), // maximum .size (bytes)  z.mime("image/png"), // MIME type  z.mime(["image/png", "image/jpeg"]); // multiple MIME types)
// usage #3
import * as z from "zod/mini";// custom checksz.refine();// first-class checksz.lt(value);z.lte(value); // alias: z.maximum()z.gt(value);z.gte(value); // alias: z.minimum()z.positive();z.negative();z.nonpositive();z.nonnegative();z.multipleOf(value);z.maxSize(value);z.minSize(value);z.size(value);z.maxLength(value);z.minLength(value);
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.maxSize', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```