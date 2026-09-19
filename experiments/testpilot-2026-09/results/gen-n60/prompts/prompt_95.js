Your task is to write a test for the following function
```
zod.z.array(element, params)
```

This function is defined as follows:
```
function array(element, params) {
    return core._array(exports.ZodArray, element, params);
}
```

You may use the following examples to guide your implementation:
```
// usage #1
const isValidId = (id: string): id is `${string}/${string}` =>  id.split("/").length === 2;const baseSchema = z.object({  id: z.string().refine(isValidId),});type Input = z.input<typeof baseSchema> & {  children: Input[];};type Output = z.output<typeof baseSchema> & {  children: Output[];};const schema: z.ZodType<Output, z.ZodTypeDef, Input> = baseSchema.extend({  children: z.lazy(() => schema.array()),});
// usage #2
const Strings = z.array(z.string()).superRefine((val, ctx) => {  if (val.length > 3) {    ctx.addIssue({      code: z.ZodIssueCode.too_big,      maximum: 3,      type: "array",      inclusive: true,      message: "Too many items 😡",    });  }  if (val.length !== new Set(val).size) {    ctx.addIssue({      code: z.ZodIssueCode.custom,      message: `No duplicates allowed.`,    });  }});
// usage #3
const stringArray = z.string().array(); // string[]// equivalent toz.array(z.string());
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.array', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```