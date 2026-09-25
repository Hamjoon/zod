Your task is to write a test for the following function
```
zod.z.iso.datetime(params)
```

This function is defined as follows:
```
function datetime(params) {
    return core._isoDateTime(exports.ZodISODateTime, params);
}
```

You may use the following examples to guide your implementation:
```
// usage #1
z.string().min(5, { message: "Must be 5 or more characters long" });z.string().max(5, { message: "Must be 5 or fewer characters long" });z.string().length(5, { message: "Must be exactly 5 characters long" });z.string().email({ message: "Invalid email address" });z.string().url({ message: "Invalid url" });z.string().emoji({ message: "Contains non-emoji characters" });z.string().uuid({ message: "Invalid UUID" });z.string().includes("tuna", { message: "Must include tuna" });z.string().startsWith("https://", { message: "Must provide secure URL" });z.string().endsWith(".com", { message: "Only .com domains allowed" });z.string().datetime({ message: "Invalid datetime string! Must be UTC." });z.string().date({ message: "Invalid date string!" });z.string().time({ message: "Invalid time string!" });z.string().ip({ message: "Invalid IP address" });z.string().cidr({ message: "Invalid CIDR" });
// usage #2
z.object({ a: z.string() }).and(z.object({ b: z.number() })); // ❌// use z.intersectionz.intersection(z.object({ a: z.string() }), z.object({ b: z.number() })); // ✅// or .extend() when possiblez.object({ a: z.string() }).extend(z.object({ b: z.number() })); // ✅``` */}## `z.number()`### no infinite values`POSITIVE_INFINITY` and `NEGATIVE_INFINITY` are no longer considered valid values for `z.number()`.### `.safe()` no longer accepts floatsIn Zod 3, `z.number().safe()` is deprecated. It now behaves identically to `.int()` (see below). Importantly, that means it no longer accepts floats.### `.int()` accepts safe integers only
// usage #3
const schema = z.string().datetime({ local: true });schema.parse("2020-01-01T00:00:00"); // passschema.parse("2020-01-01T00:00"); // pass
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.iso.datetime', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```