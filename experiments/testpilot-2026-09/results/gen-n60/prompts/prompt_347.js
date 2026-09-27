Your task is to write a test for the following function
```
zod.z.coerce.boolean(params)
```

You may use the following examples to guide your implementation:
```
// usage #1
const schema = z.coerce.boolean(); // Boolean(input)schema.parse("tuna"); // => trueschema.parse("true"); // => trueschema.parse("false"); // => trueschema.parse(1); // => trueschema.parse([]); // => trueschema.parse(0); // => falseschema.parse(""); // => falseschema.parse(undefined); // => falseschema.parse(null); // => false
// usage #2
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);type Literal = z.infer<typeof literalSchema>;type Json = Literal | { [key: string]: Json } | Json[];const jsonSchema: z.ZodType<Json> = z.lazy(() =>  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]));jsonSchema.parse(data);
// usage #3
z.boolean().parse(true); // => truez.boolean().parse(false); // => false
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.coerce.boolean', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```