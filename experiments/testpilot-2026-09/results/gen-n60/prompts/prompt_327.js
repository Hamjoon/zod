Your task is to write a test for the following function
```
zod.z.safeParse(schema, value, _ctx)
```

This function is defined as follows:
```
(schema, value, _ctx) => {
    const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
    const result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) {
        throw new core.$ZodAsyncError();
    }
    return result.issues.length
        ? {
            success: false,
            error: new (_Err ?? errors.$ZodError)(result.issues.map((iss) => util.finalizeIssue(iss, ctx, core.config()))),
        }
        : { success: true, data: result.value };
}
```

You may use the following examples to guide your implementation:
```
// usage #1
const stringOrNumber = z.string().or(z.number());``` */}{/* **Optional string validation:**To validate an optional form input, you can union the desired string validation with an empty string [literal](#literals).This example validates an input that is optional but needs to contain a [valid URL](#strings):```tsconst optionalUrl = z.union([z.string().url().nullish(), z.literal("")]);console.log(optionalUrl.safeParse(undefined).success); // trueconsole.log(optionalUrl.safeParse(null).success); // trueconsole.log(optionalUrl.safeParse("").success); // trueconsole.log(optionalUrl.safeParse("https://zod.dev").success); // trueconsole.log(optionalUrl.safeParse("not a valid url").success); // false
// usage #2
const schema = z  .object({    password: z.string().min(8),    confirmPassword: z.string(),    anotherField: z.string(),  })  .refine((data) => data.password === data.confirmPassword, {    message: "Passwords do not match",    path: ["confirmPassword"],    // run if password & confirmPassword are valid    when(payload) { // [!code ++]      return schema // [!code ++]        .pick({ password: true, confirmPassword: true }) // [!code ++]        .safeParse(payload.value).success; // [!code ++]    },  // [!code ++]  });schema.parse({  password: "asdf",
// usage #3
const result = z.string().safeParse(12); result.error! instanceof Error; // => false
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.safeParse', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```