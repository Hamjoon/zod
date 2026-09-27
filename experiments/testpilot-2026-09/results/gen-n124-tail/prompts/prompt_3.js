Your task is to write a test for the following function
```
zod.z.startsWith(prefix, params)
```

This function is defined as follows:
```
function _startsWith(prefix, params) {
    return new checks.$ZodCheckStartsWith({
        check: "string_format",
        format: "starts_with",
        ...util.normalizeParams(params),
        prefix,
    });
}
```

You may use the following examples to guide your implementation:
```
// usage #1
// validationsz.string().max(5);z.string().min(5);z.string().length(5);z.string().email();z.string().url();z.string().emoji();z.string().uuid();z.string().nanoid();z.string().cuid();z.string().cuid2();z.string().ulid();z.string().regex(regex);z.string().includes(string);z.string().startsWith(string);z.string().endsWith(string);z.string().datetime(); // ISO 8601; by default only `Z` timezone allowedz.string().ip(); // defaults to allow both IPv4 and IPv6z.string().cidr(); // defaults to allow both IPv4 and IPv6
// usage #2
z.string().min(5, { message: "Must be 5 or more characters long" });z.string().max(5, { message: "Must be 5 or fewer characters long" });z.string().length(5, { message: "Must be exactly 5 characters long" });z.string().email({ message: "Invalid email address" });z.string().url({ message: "Invalid url" });z.string().emoji({ message: "Contains non-emoji characters" });z.string().uuid({ message: "Invalid UUID" });z.string().includes("tuna", { message: "Must include tuna" });z.string().startsWith("https://", { message: "Must provide secure URL" });z.string().endsWith(".com", { message: "Only .com domains allowed" });z.string().datetime({ message: "Invalid datetime string! Must be UTC." });z.string().date({ message: "Invalid date string!" });z.string().time({ message: "Invalid time string!" });z.string().ip({ message: "Invalid IP address" });z.string().cidr({ message: "Invalid CIDR" });
// usage #3
z.string().max(5);z.string().min(5);z.string().length(5);z.string().regex(/^[a-z]+$/);z.string().startsWith("aaa");z.string().endsWith("zzz");z.string().includes("---");z.string().uppercase();z.string().lowercase();
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.startsWith', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```