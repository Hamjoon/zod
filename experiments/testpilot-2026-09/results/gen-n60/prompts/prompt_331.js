Your task is to write a test for the following function
```
zod.z.parseAsync(schema, value, _ctx, params) async
```

This function is defined as follows:
```
async (schema, value, _ctx, params) => {
    const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
    let result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
        result = await result;
    if (result.issues.length) {
        const e = new (params?.Err ?? _Err)(result.issues.map((iss) => util.finalizeIssue(iss, ctx, core.config())));
        util.captureStackTrace(e, params?.callee);
        throw e;
    }
    return result.value;
}
```

You may use the following examples to guide your implementation:
```
// usage #1
import * as z from "zod/v4/core";const schema = new z.$ZodString({ type: "string" });z.parse(schema, "hello");z.safeParse(schema, "hello");await z.parseAsync(schema, "hello");await z.safeParseAsync(schema, "hello");
// usage #2
import * as z from "zod";const mySchema = z.string();// parsingmySchema.parse(data);mySchema.safeParse(data);mySchema.parseAsync(data);mySchema.safeParseAsync(data);// refinementsmySchema.refine(refinementFunc);mySchema.superRefine(refinementFunc); // deprecated, use `.check()`mySchema.overwrite(overwriteFunc);// wrappersmySchema.optional();mySchema.nonoptional();mySchema.nullable();
// usage #3
const schema = z.string().refine(async (val) => val.length <= 8);await schema.parseAsync("hello");// => "hello"
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.parseAsync', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```