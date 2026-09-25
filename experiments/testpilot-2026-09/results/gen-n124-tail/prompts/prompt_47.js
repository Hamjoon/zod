Your task is to write a test for the following function
```
zod.z.toLowerCase()
```

This function is defined as follows:
```
function _toLowerCase() {
    return _overwrite((input) => input.toLowerCase());
}
```

You may use the following examples to guide your implementation:
```
// usage #1
const myString = z.string()  .refine((val) => val.length > 8, { error: "Too short!" })  .refine((val) => val === val.toLowerCase(), { error: "Must be lowercase" });  const result = myString.safeParse("OH NO");result.error.issues;/* [  { "code": "custom", "message": "Too short!" },  { "code": "custom", "message": "Must be lowercase" }] */
// usage #2
const myString = z.string()  .refine((val) => val.length > 8, { error: "Too short!", abort: true })  .refine((val) => val === val.toLowerCase(), { error: "Must be lowercase", abort: true });const result = myString.safeParse("OH NO");result.error!.issues;// => [{ "code": "custom", "message": "Too short!" }]
// usage #3
z.string()  .min(5)  .max(10)  .toLowerCase();
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.toLowerCase', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```