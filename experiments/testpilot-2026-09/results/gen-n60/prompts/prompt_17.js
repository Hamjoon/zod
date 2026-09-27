Your task is to write a test for the following function
```
zod.z.file(params)
```

This function is defined as follows:
```
function file(params) {
    return core._file(exports.ZodFile, params);
}
```

You may use the following examples to guide your implementation:
```
// usage #1
z.file();// => { type: "string", format: "binary", contentEncoding: "binary" }
// usage #2
z.file().min(1).max(1024 * 1024).mime("image/png");// => {//   type: "string",//   format: "binary",//   contentEncoding: "binary",//   contentMediaType: "image/png",//   minLength: 1,//   maxLength: 1048576,// }
// usage #3
const fileSchema = z.file();fileSchema.min(10_000); // minimum .size (bytes)fileSchema.max(1_000_000); // maximum .size (bytes)fileSchema.mime(["image/png"]); // MIME type
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.file', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```