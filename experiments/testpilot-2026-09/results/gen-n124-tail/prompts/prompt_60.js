Your task is to write a test for the following function
```
zod.z.parse(schema, value, _ctx, _params)
```

You may use the following examples to guide your implementation:
```
// usage #1
const a = z.iso.datetime();a.parse("2020-01-01T06:15Z"); // ✅a.parse("2020-01-01T06:15:00Z"); // ✅a.parse("2020-01-01T06:15:00.123Z"); // ✅const b = z.iso.datetime({ precision: -1 }); // minute precision (no seconds)b.parse("2020-01-01T06:15Z"); // ✅b.parse("2020-01-01T06:15:00Z"); // ❌b.parse("2020-01-01T06:15:00.123Z"); // ❌const c = z.iso.datetime({ precision: 0 }); // second precision onlyc.parse("2020-01-01T06:15Z"); // ❌c.parse("2020-01-01T06:15:00Z"); // ✅c.parse("2020-01-01T06:15:00.123Z"); // ❌const d = z.iso.datetime({ precision: 3 }); // millisecond precision onlyd.parse("2020-01-01T06:15Z"); // ❌d.parse("2020-01-01T06:15:00Z"); // ❌d.parse("2020-01-01T06:15:00.123Z"); // ✅
// usage #2
const strbool = z.stringbool();strbool.parse("true")         // => truestrbool.parse("1")            // => truestrbool.parse("yes")          // => truestrbool.parse("on")           // => truestrbool.parse("y")            // => truestrbool.parse("enabled")      // => truestrbool.parse("false");       // => falsestrbool.parse("0");           // => falsestrbool.parse("no");          // => falsestrbool.parse("off");         // => falsestrbool.parse("n");           // => falsestrbool.parse("disabled");    // => falsestrbool.parse(/* anything else */); // ZodError<[{ code: "invalid_value" }]>
// usage #3
Dog.parse({ name: "Yeller", extraKey: true });// => { name: "Yeller" }
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.parse', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```