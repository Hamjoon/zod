Your task is to write a test for the following function
```
zod.z.optional(innerType)
```

This function is defined as follows:
```
function optional(innerType) {
    return new exports.ZodOptional({
        type: "optional",
        innerType: innerType,
    });
}
```

You may use the following examples to guide your implementation:
```
// usage #1
  // all properties are required by default  const Person = z.object({    name: z.string(),    age: z.number(),  });  type Person = z.infer<typeof Person>;  // => { name: string; age: number; }  ```By default, all properties are required. To make certain properties optional:<Tabs groupId="lib" items={["Zod", "Zod Mini"]}><Tab value="Zod">```ts z.objectconst Dog = z.object({  name: z.string(),  age: z.number().optional(),});Dog.parse({ name: "Yeller" }); // ✅
// usage #2
import * as z from "zod";const mySchema = z.string();// parsingmySchema.parse(data);mySchema.safeParse(data);mySchema.parseAsync(data);mySchema.safeParseAsync(data);// refinementsmySchema.refine(refinementFunc);mySchema.superRefine(refinementFunc); // deprecated, use `.check()`mySchema.overwrite(overwriteFunc);// wrappersmySchema.optional();mySchema.nonoptional();mySchema.nullable();
// usage #3
z.optional(z.string());// => { type: "string" }
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.optional', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```