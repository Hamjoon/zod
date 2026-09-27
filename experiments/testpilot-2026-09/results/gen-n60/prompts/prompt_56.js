Your task is to write a test for the following function
```
zod.z.strictObject(shape, params)
```

You may use the following examples to guide your implementation:
```
// usage #1
const StrictDog = z.strictObject({  name: z.string(),});StrictDog.parse({ name: "Yeller", extraKey: true });// ❌ throws
// usage #2
import * as z from "zod";const schema = z.strictObject({  username: z.string(),  favoriteNumbers: z.array(z.number()),});
// usage #3
// Zod 3z.object({ name: z.string() }).strict();z.object({ name: z.string() }).passthrough();// Zod 4z.strictObject({ name: z.string() });z.looseObject({ name: z.string() });
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.strictObject', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```