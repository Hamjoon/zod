Your task is to write a test for the following function
```
zod.z.instanceof(cls, params = {
    error: `Input not instance of ${cls.name}`,
})
```

You may use the following examples to guide your implementation:
```
// usage #1
class Test {  name: string;}const TestSchema = z.instanceof(Test);TestSchema.parse(new Test()); // ✅TestSchema.parse("whatever"); // ❌
// usage #2
const myUnion = z.discriminatedUnion("status", [  z.object({ status: z.literal("success"), data: z.string() }),  z.object({ status: z.literal("failed"), error: z.instanceof(Error) }),]);myUnion.parse({ status: "success", data: "yippie ki yay" });
// usage #3
class Test {  name: string;}const TestSchema = z.instanceof(Test);const blob: any = "whatever";TestSchema.parse(new Test()); // passesTestSchema.parse(blob); // throws
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.instanceof', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```