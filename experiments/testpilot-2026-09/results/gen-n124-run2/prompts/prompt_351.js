Your task is to write a test for the following function
```
zod.z.intersection(left, right)
```

This function is defined as follows:
```
function intersection(left, right) {
    return new exports.ZodIntersection({
        type: "intersection",
        left: left,
        right: right,
    });
}
```

You may use the following examples to guide your implementation:
```
// usage #1
const Person = z.object({ name: z.string() });type Person = z.infer<typeof Person>;const Employee = z.object({ role: z.string() });type Employee = z.infer<typeof Employee>;const EmployedPerson = z.intersection(Person, Employee);type EmployedPerson = z.infer<typeof EmployedPerson>;// Person & Employee
// usage #2
z.object({ a: z.string() }).and(z.object({ b: z.number() })); // ❌// use z.intersectionz.intersection(z.object({ a: z.string() }), z.object({ b: z.number() })); // ✅// or .extend() when possiblez.object({ a: z.string() }).extend(z.object({ b: z.number() })); // ✅``` */}## `z.number()`### no infinite values`POSITIVE_INFINITY` and `NEGATIVE_INFINITY` are no longer considered valid values for `z.number()`.### `.safe()` no longer accepts floatsIn Zod 3, `z.number().safe()` is deprecated. It now behaves identically to `.int()` (see below). Importantly, that means it no longer accepts floats.### `.int()` accepts safe integers only
// usage #3
const Person = z.object({  name: z.string(),});const Employee = z.object({  role: z.string(),});const EmployedPerson = z.intersection(Person, Employee);
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.intersection', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```