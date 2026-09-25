Your task is to write a test for the following function
```
zod.z.object(shape, params)
```

This function is defined as follows:
```
function object(shape, params) {
    const def = {
        type: "object",
        get shape() {
            index_js_1.util.assignProp(this, "shape", { ...shape });
            return this.shape;
        },
        ...index_js_1.util.normalizeParams(params),
    };
    return new exports.ZodObject(def);
}
```

You may use the following examples to guide your implementation:
```
// usage #1
const schema = z  .object({    first: z.string(),    second: z.number(),  })  .nullable()  .superRefine((arg, ctx): arg is { first: string; second: number } => {    if (!arg) {      ctx.addIssue({        code: z.ZodIssueCode.custom, // customize your issue        message: "object should exist",      });    }    return z.NEVER; // The return value is not used, but we need to return something to satisfy the typing  })  // here, TS knows that arg is not null  .refine((arg) => arg.first === "bob", "`first` is not `bob`!");
// usage #2
z.object({ a: z.string() }).and(z.object({ b: z.number() })); // ❌// use z.intersectionz.intersection(z.object({ a: z.string() }), z.object({ b: z.number() })); // ✅// or .extend() when possiblez.object({ a: z.string() }).extend(z.object({ b: z.number() })); // ✅``` */}## `z.number()`### no infinite values`POSITIVE_INFINITY` and `NEGATIVE_INFINITY` are no longer considered valid values for `z.number()`.### `.safe()` no longer accepts floatsIn Zod 3, `z.number().safe()` is deprecated. It now behaves identically to `.int()` (see below). Importantly, that means it no longer accepts floats.### `.int()` accepts safe integers only
// usage #3
const DogWithBreed = z.object({  ...Dog.shape,  breed: z.string(),});
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.object', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```