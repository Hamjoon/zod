The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.templateLiteral', function(done) {
        // 1️⃣ Simple template with a string interpolation
        const helloSchema = zod.z.templateLiteral(["hello, ", zod.z.string(), "!"]);
        assert.strictEqual(helloSchema.parse("hello, world!"), "hello, world!");
        assert.throws(() => helloSchema.parse("hello, 123!"));

        // 2️⃣ Template consisting of a static literal only
        const hiSchema = zod.z.templateLiteral(["hi there"]);
        assert.strictEqual(hiSchema.parse("hi there"), "hi there");
        assert.throws(() => hiSchema.parse("hi there!"));

        // 3️⃣ Nullable literal inside a template
        const grassySchema = zod.z.templateLiteral([zod.z.nullable(zod.z.literal("grassy"))]);
        assert.strictEqual(grassySchema.parse("grassy"), "grassy");
        assert.strictEqual(grassySchema.parse(null), null);
        assert.throws(() => grassySchema.parse("grass"));

        // 4️⃣ Number followed by an enum (e.g., CSS units)
        const cssUnits = zod.z.enum(["px", "em", "rem", "%"]);
        const cssSchema = zod.z.templateLiteral([zod.z.number(), cssUnits]);
        assert.strictEqual(cssSchema.parse("12px"), "12px");
        assert.strictEqual(cssSchema.parse("0%"), "0%");
        assert.throws(() => cssSchema.parse("12pt"));

        done();
    });
});
``` 
failed with the following error message:
```
Missing expected exception.  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.