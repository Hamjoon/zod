Your task is to write a test for the following function
```
zod.z.regex(pattern, params)
```

You may use the following examples to guide your implementation:
```
// usage #1
z.lt(value);z.lte(value); // alias: z.maximum()z.gt(value);z.gte(value); // alias: z.minimum()z.positive();z.negative();z.nonpositive();z.nonnegative();z.multipleOf(value);z.maxSize(value);z.minSize(value);z.size(value);z.maxLength(value);z.minLength(value);z.length(value);z.regex(regex);z.lowercase();z.uppercase();z.includes(value);z.startsWith(value);
// usage #2
// validationsz.string().max(5);z.string().min(5);z.string().length(5);z.string().email();z.string().url();z.string().emoji();z.string().uuid();z.string().nanoid();z.string().cuid();z.string().cuid2();z.string().ulid();z.string().regex(regex);z.string().includes(string);z.string().startsWith(string);z.string().endsWith(string);z.string().datetime(); // ISO 8601; by default only `Z` timezone allowedz.string().ip(); // defaults to allow both IPv4 and IPv6z.string().cidr(); // defaults to allow both IPv4 and IPv6
// usage #3
z.base64url();z.cuid();z.regex();z.emoji();z.nanoid();z.cuid2();z.ulid();z.cidrv4();z.cidrv6();
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.regex', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```