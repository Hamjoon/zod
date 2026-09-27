The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.file', function(done) {
        // 1️⃣ Base schema – no options
        const baseSchema = zod.z.file();
        const expectedBase = {
            type: "string",
            format: "binary",
            contentEncoding: "binary"
        };
        assert.deepStrictEqual(baseSchema, expectedBase, 'Base file schema does not match expected');

        // 2️⃣ Chained options – min, max, mime (single string)
        const chainedSchema = zod.z.file()
            .min(1)
            .max(1024 * 1024)
            .mime("image/png");
        const expectedChained = {
            type: "string",
            format: "binary",
            contentEncoding: "binary",
            contentMediaType: "image/png",
            minLength: 1,
            maxLength: 1024 * 1024
        };
        assert.deepStrictEqual(chainedSchema, expectedChained, 'Chained file schema does not match expected');

        // 3️⃣ Mime with an array of types
        const arrayMimeSchema = zod.z.file().mime(["image/png", "image/jpeg"]);
        const expectedArrayMime = {
            type: "string",
            format: "binary",
            contentEncoding: "binary",
            contentMediaType: ["image/png", "image/jpeg"]
        };
        assert.deepStrictEqual(arrayMimeSchema, expectedArrayMime, 'Mime array schema does not match expected');

        done();
    });
});
``` 
failed with the following error message:
```
Base file schema does not match expected
+ actual - expected

+ ZodFile {
+   '~standard': {
+     validate: [Function: validate],
+     vendor: 'zod',
+     version: 1
+   },
+   and: [Function (anonymous)],
+   array: [Function (anonymous)],
+   brand: [Function (anonymous)],
+   catch: [Function (anonymous)],
+   check: [Function (anonymous)],
+   clone: [Function (anonymous)],
+   def: {
+     type: 'file'
+   },
+   default: [Function (anonymous)],
+   describe: [Function (anonymous)],
+   isNullable: [Function (anonymous)],
+   isOptional: [Function (anonymous)],
+   max: [Function (anonymous)],
+   meta: [Function (anonymous)],
+   mime: [Function (anonymous)],
+   min: [Function (anonymous)],
+   nonoptional: [Function (anonymous)],
+   nullable: [Function (anonymous)],
+   nullish: [Function (anonymous)],
+   optional: [Function (anonymous)],
+   or: [Function (anonymous)],
+   overwrite: [Function (anonymous)],
+   parse: [Function (anonymous)],
+   parseAsync: [AsyncFunction (anonymous)],
+   pipe: [Function (anonymous)],
+   prefault: [Function (anonymous)],
+   readonly: [Function (anonymous)],
+   refine: [Function (anonymous)],
+   register: [Function (anonymous)],
+   safeParse: [Function (anonymous)],
+   safeParseAsync: [AsyncFunction (anonymous)],
+   spa: [AsyncFunction (anonymous)],
+   superRefine: [Function (anonymous)],
+   transform: [Function (anonymous)]
- {
-   contentEncoding: 'binary',
-   format: 'binary',
-   type: 'string'
  }
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.