Your task is to write a test for the following function
```
zod.z.literal(value, params)
```

This function is defined as follows:
```
function literal(value, params) {
    return new exports.ZodLiteral({
        type: "literal",
        values: Array.isArray(value) ? value : [value],
        ...index_js_1.util.normalizeParams(params),
    });
}
```

You may use the following examples to guide your implementation:
```
// usage #1
const stringOrNumber = z.string().or(z.number());``` */}{/* **Optional string validation:**To validate an optional form input, you can union the desired string validation with an empty string [literal](#literals).This example validates an input that is optional but needs to contain a [valid URL](#strings):```tsconst optionalUrl = z.union([z.string().url().nullish(), z.literal("")]);console.log(optionalUrl.safeParse(undefined).success); // trueconsole.log(optionalUrl.safeParse(null).success); // trueconsole.log(optionalUrl.safeParse("").success); // trueconsole.log(optionalUrl.safeParse("https://zod.dev").success); // trueconsole.log(optionalUrl.safeParse("not a valid url").success); // false
// usage #2
const optionalUrl = z.union([z.string().url().nullish(), z.literal("")]);console.log(optionalUrl.safeParse(undefined).success); // trueconsole.log(optionalUrl.safeParse(null).success); // trueconsole.log(optionalUrl.safeParse("").success); // trueconsole.log(optionalUrl.safeParse("https://zod.dev").success); // trueconsole.log(optionalUrl.safeParse("not a valid url").success); // false
// usage #3
const colors = z.literal(["red", "green", "blue"]);colors.parse("green"); // ✅colors.parse("yellow"); // ❌
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.literal', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```