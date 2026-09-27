Your task is to write a test for the following function
```
zod.z.int64(params)
```

You may use the following examples to guide your implementation:
```
// usage #1
z.int64({  error: (issue) => {    // override too_big error message    if (issue.code === "too_big") {      return { message: `Value must be <${issue.maximum}` };    }    //  defer to default    return undefined;  },});
// usage #2
z.bigint(); // ❌z.int64(); // ❌z.symbol(); // ❌z.void(); // ❌z.date(); // ❌z.map(); // ❌z.set(); // ❌z.transform(); // ❌z.nan(); // ❌z.custom(); // ❌
// usage #3
z.int64();    // [-9223372036854775808n, 9223372036854775807n]z.uint64();   // [0n, 18446744073709551615n]
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.int64', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```