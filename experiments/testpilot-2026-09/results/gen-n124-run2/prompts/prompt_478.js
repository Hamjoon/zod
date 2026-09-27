Your task is to write a test for the following function
```
zod.z.readonly(innerType)
```

This function is defined as follows:
```
function readonly(innerType) {
    return new exports.ZodReadonly({
        type: "readonly",
        innerType: innerType,
    });
}
```

You may use the following examples to guide your implementation:
```
// usage #1
const schema = z.object({ name: z.string() }).readonly();type schema = z.infer<typeof schema>;// Readonly<{name: string}>const result = schema.parse({ name: "fido" });result.name = "simba"; // error
// usage #2
const ReadonlyUser = z.object({ name: z.string() }).readonly();type ReadonlyUser = z.infer<typeof ReadonlyUser>;// Readonly<{ name: string }>
// usage #3
z.array(z.string()).readonly();// readonly string[]z.tuple([z.string(), z.number()]).readonly();// readonly [string, number]z.map(z.string(), z.date()).readonly();// ReadonlyMap<string, Date>z.set(z.string()).readonly();// ReadonlySet<string>
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.readonly', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```