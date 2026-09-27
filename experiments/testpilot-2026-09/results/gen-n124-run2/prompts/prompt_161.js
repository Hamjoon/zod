Your task is to write a test for the following function
```
zod.z.ipv6(params)
```

This function is defined as follows:
```
function ipv6(params) {
    return core._ipv6(exports.ZodIPv6, params);
}
```

You may use the following examples to guide your implementation:
```
// usage #1
// Supported via `format`z.email(); // => { type: "string", format: "email" }z.iso.datetime(); // => { type: "string", format: "date-time" }z.iso.date(); // => { type: "string", format: "date" }z.iso.time(); // => { type: "string", format: "time" }z.iso.duration(); // => { type: "string", format: "duration" }z.ipv4(); // => { type: "string", format: "ipv4" }z.ipv6(); // => { type: "string", format: "ipv6" }z.uuid(); // => { type: "string", format: "uuid" }z.guid(); // => { type: "string", format: "uuid" }z.url(); // => { type: "string", format: "uri" }
// usage #2
z.string().ip() // ❌z.ipv4() // ✅z.ipv6() // ✅
// usage #3
z.email();z.uuidv4();z.uuidv7();z.uuidv8();z.ipv4();z.ipv6();z.cidrv4();z.cidrv6();z.url();z.e164();z.base64();z.base64url();z.jwt();z.ascii();z.utf8();z.lowercase();z.iso.date();z.iso.datetime();z.iso.duration();z.iso.time();
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.ipv6', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```