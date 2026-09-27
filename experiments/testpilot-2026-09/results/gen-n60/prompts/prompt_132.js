Your task is to write a test for the following function
```
zod.z.never(params)
```

This function is defined as follows:
```
function never(params) {
    return core._never(exports.ZodNever, params);
}
```

You may use the following examples to guide your implementation:
```
// usage #1
const Keys = z.enum(["id", "name", "email"]).or(z.never()); const Person = z.partialRecord(Keys, z.string());// { id?: string; name?: string; email?: string }
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.never', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```