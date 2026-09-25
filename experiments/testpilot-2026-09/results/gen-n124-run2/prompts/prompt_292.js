Your task is to write a test for the following function
```
zod.z.void(params)
```

You may use the following examples to guide your implementation:
```
// usage #1
z.null();z.undefined();z.void(); // equivalent to z.undefined()
// usage #2
z.bigint(); // ❌z.int64(); // ❌z.symbol(); // ❌z.void(); // ❌z.date(); // ❌z.map(); // ❌z.set(); // ❌z.transform(); // ❌z.nan(); // ❌z.custom(); // ❌
// usage #3
import * as z from "zod/v3";// primitive valuesz.string();z.number();z.bigint();z.boolean();z.date();z.symbol();// empty typesz.undefined();z.null();z.void(); // accepts undefined// catch-all types// allows any valuez.any();z.unknown();
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.void', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```