Your task is to write a test for the following function
```
zod.z.discriminatedUnion(discriminator, options, params)
```

You may use the following examples to guide your implementation:
```
// usage #1
const MyResult = z.discriminatedUnion("status", [  // simple literal  z.object({ status: z.literal("aaa"), data: z.string() }),  // union discriminator  z.object({ status: z.union([z.literal("bbb"), z.literal("ccc")]) }),  // pipe discriminator  z.object({ status: z.literal("fail").transform(val => val.toUpperCase()) }),]);
// usage #2
const BaseError = z.object({ status: z.literal("failed"), message: z.string() });const MyResult = z.discriminatedUnion("status", [  z.object({ status: z.literal("success"), data: z.string() }),  z.discriminatedUnion("code", [    BaseError.extend({ code: z.literal(400) }),    BaseError.extend({ code: z.literal(401) }),    BaseError.extend({ code: z.literal(500) })  ])]);
// usage #3
const MyResult = z.discriminatedUnion("status", [  z.object({ status: z.literal("success"), data: z.string() }),  z.object({ status: z.literal("failed"), error: z.string() }),]);
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.discriminatedUnion', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.

Provide your answer as a fenced code block 
```
<unit test>
```