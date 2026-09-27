Your task is to write a test for the following function
```
zod.z.symbol(params)
```

This function is defined as follows:
```
function symbol(params) {
    return core._symbol(exports.ZodSymbol, params);
}
```

You may use the following examples to guide your implementation:
```
// usage #1
const Keys = z.union([z.string(), z.number(), z.symbol()]);const AnyObject = z.record(Keys, z.unknown());// Record<string | number | symbol, unknown>
// usage #2
import * as z from "zod/v3";// primitive valuesz.string();z.number();z.bigint();z.boolean();z.date();z.symbol();// empty typesz.undefined();z.null();z.void(); // accepts undefined// catch-all types// allows any valuez.any();z.unknown();
// usage #3
import * as z from "zod";// primitive typesz.string();z.number();z.bigint();z.boolean();z.symbol();z.undefined();z.null();
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.symbol', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```