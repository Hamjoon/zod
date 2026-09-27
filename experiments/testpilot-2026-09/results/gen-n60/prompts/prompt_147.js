Your task is to write a test for the following function
```
zod.z.looseObject(shape, params)
```

You may use the following examples to guide your implementation:
```
// usage #1
const LooseDog = z.looseObject({  name: z.string(),});Dog.parse({ name: "Yeller", extraKey: true });// => { name: "Yeller", extraKey: true }
// usage #2
// Zod 3z.object({ name: z.string() }).strict();z.object({ name: z.string() }).passthrough();// Zod 4z.strictObject({ name: z.string() });z.looseObject({ name: z.string() });
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.looseObject', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```