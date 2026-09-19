Your task is to write a test for the following function
```
zod.z.coerce.number(params)
```

You may use the following examples to guide your implementation:
```
// usage #1
const stringOrNumber = z.string().or(z.number());``` */}{/* **Optional string validation:**To validate an optional form input, you can union the desired string validation with an empty string [literal](#literals).This example validates an input that is optional but needs to contain a [valid URL](#strings):```tsconst optionalUrl = z.union([z.string().url().nullish(), z.literal("")]);console.log(optionalUrl.safeParse(undefined).success); // trueconsole.log(optionalUrl.safeParse(null).success); // trueconsole.log(optionalUrl.safeParse("").success); // trueconsole.log(optionalUrl.safeParse("https://zod.dev").success); // trueconsole.log(optionalUrl.safeParse("not a valid url").success); // false
// usage #2
z.object({ a: z.string() }).and(z.object({ b: z.number() })); // ❌// use z.intersectionz.intersection(z.object({ a: z.string() }), z.object({ b: z.number() })); // ✅// or .extend() when possiblez.object({ a: z.string() }).extend(z.object({ b: z.number() })); // ✅``` */}## `z.number()`### no infinite values`POSITIVE_INFINITY` and `NEGATIVE_INFINITY` are no longer considered valid values for `z.number()`.### `.safe()` no longer accepts floatsIn Zod 3, `z.number().safe()` is deprecated. It now behaves identically to `.int()` (see below). Importantly, that means it no longer accepts floats.### `.int()` accepts safe integers only
// usage #3
z.number().overwrite(val => val ** 2).max(100);// => ZodNumber
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.coerce.number', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```