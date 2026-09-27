Your task is to write a test for the following function
```
zod.z.any()
```

You may use the following examples to guide your implementation:
```
// usage #1
// allows any valuesz.any(); // inferred type: `any`z.unknown(); // inferred type: `unknown`
// usage #2
import * as z from "zod/v3";// primitive valuesz.string();z.number();z.bigint();z.boolean();z.date();z.symbol();// empty typesz.undefined();z.null();z.void(); // accepts undefined// catch-all types// allows any valuez.any();z.unknown();
// usage #3
const mySchema = z.object({  a: z.any(),  b: z.unknown()});// Zod 3: { a?: any; b?: unknown };// Zod 4: { a: any; b: unknown };
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.any', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```