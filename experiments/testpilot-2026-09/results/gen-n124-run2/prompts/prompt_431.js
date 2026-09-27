Your task is to write a test for the following function
```
zod.z.nullable(innerType)
```

This function is defined as follows:
```
function nullable(innerType) {
    return new exports.ZodNullable({
        type: "nullable",
        innerType: innerType,
    });
}
```

You may use the following examples to guide your implementation:
```
// usage #1
const schema = z  .object({    first: z.string(),    second: z.number(),  })  .nullable()  .superRefine((arg, ctx): arg is { first: string; second: number } => {    if (!arg) {      ctx.addIssue({        code: z.ZodIssueCode.custom, // customize your issue        message: "object should exist",      });    }    return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing  })  // here, TS knows that arg is not null  .refine((arg) => arg.first === "bob", "`first` is not `bob`!");
// usage #2
import * as z from "zod";const mySchema = z.string();// parsingmySchema.parse(data);mySchema.safeParse(data);mySchema.parseAsync(data);mySchema.safeParseAsync(data);// refinementsmySchema.refine(refinementFunc);mySchema.superRefine(refinementFunc); // deprecated, use `.check()`mySchema.overwrite(overwriteFunc);// wrappersmySchema.optional();mySchema.nonoptional();mySchema.nullable();
// usage #3
// regular Zodconst mySchema = z.string().optional().nullable();
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nullable', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```