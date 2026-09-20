Your task is to write a test for the following function
```
zod.z.iso.duration(params)
```

This function is defined as follows:
```
function duration(params) {
    return core._isoDuration(exports.ZodISODuration, params);
}
```

You may use the following examples to guide your implementation:
```
// usage #1
z.email();z.uuid();z.url();z.emoji();         // validates a single emoji characterz.base64();z.base64url();z.nanoid();z.cuid();z.cuid2();z.ulid();z.ipv4();z.ipv6();z.cidrv4();        // ipv4 CIDR blockz.cidrv6();        // ipv6 CIDR blockz.iso.date();z.iso.time();z.iso.datetime();z.iso.duration();
// usage #2
// Supported via `format`z.email(); // => { type: "string", format: "email" }z.iso.datetime(); // => { type: "string", format: "date-time" }z.iso.date(); // => { type: "string", format: "date" }z.iso.time(); // => { type: "string", format: "time" }z.iso.duration(); // => { type: "string", format: "duration" }z.ipv4(); // => { type: "string", format: "ipv4" }z.ipv6(); // => { type: "string", format: "ipv6" }z.uuid(); // => { type: "string", format: "uuid" }z.guid(); // => { type: "string", format: "uuid" }z.url(); // => { type: "string", format: "uri" }
// usage #3
z.email();z.uuidv4();z.uuidv7();z.uuidv8();z.ipv4();z.ipv6();z.cidrv4();z.cidrv6();z.url();z.e164();z.base64();z.base64url();z.jwt();z.ascii();z.utf8();z.lowercase();z.iso.date();z.iso.datetime();z.iso.duration();z.iso.time();
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.iso.duration', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```