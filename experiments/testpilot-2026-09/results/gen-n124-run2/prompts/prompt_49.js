Your task is to write a test for the following function
```
zod.z.coerce.bigint(params)
```

You may use the following examples to guide your implementation:
```
// usage #1
import * as z from "zod/v3";// primitive valuesz.string();z.number();z.bigint();z.boolean();z.date();z.symbol();// empty typesz.undefined();z.null();z.void(); // accepts undefined// catch-all types// allows any valuez.any();z.unknown();
// usage #2
z.bigint().gt(5n);z.bigint().gte(5n); // alias `.min(5n)`z.bigint().lt(5n);z.bigint().lte(5n); // alias `.max(5n)`z.bigint().positive(); // > 0nz.bigint().nonnegative(); // >= 0nz.bigint().negative(); // < 0nz.bigint().nonpositive(); // <= 0nz.bigint().multipleOf(5n); // Evenly divisible by 5n.
// usage #3
z.toJSONSchema(z.bigint());// => throws Error
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.coerce.bigint', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```