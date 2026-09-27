Your task is to write a test for the following function
```
zod.z.coerce.date(params)
```

You may use the following examples to guide your implementation:
```
// usage #1
z.string().min(5, { message: "Must be 5 or more characters long" });z.string().max(5, { message: "Must be 5 or fewer characters long" });z.string().length(5, { message: "Must be exactly 5 characters long" });z.string().email({ message: "Invalid email address" });z.string().url({ message: "Invalid url" });z.string().emoji({ message: "Contains non-emoji characters" });z.string().uuid({ message: "Invalid UUID" });z.string().includes("tuna", { message: "Must include tuna" });z.string().startsWith("https://", { message: "Must provide secure URL" });z.string().endsWith(".com", { message: "Only .com domains allowed" });z.string().datetime({ message: "Invalid datetime string! Must be UTC." });z.string().date({ message: "Invalid date string!" });z.string().time({ message: "Invalid time string!" });z.string().ip({ message: "Invalid IP address" });z.string().cidr({ message: "Invalid CIDR" });
// usage #2
const dateSchema = z.coerce.date();type DateSchema = z.infer<typeof dateSchema>;// type DateSchema = Date/* valid dates */console.log(dateSchema.safeParse("2023-01-10T00:00:00.000Z").success); // trueconsole.log(dateSchema.safeParse("2023-01-10").success); // trueconsole.log(dateSchema.safeParse("1/10/23").success); // trueconsole.log(dateSchema.safeParse(new Date("1/10/23")).success); // true/* invalid dates */console.log(dateSchema.safeParse("2023-13-10").success); // falseconsole.log(dateSchema.safeParse("0000-00-00").success); // false
// usage #3
Post.pick({ title: true })Post.partial();Post.extend({ publishDate: z.date() });
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.coerce.date', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```