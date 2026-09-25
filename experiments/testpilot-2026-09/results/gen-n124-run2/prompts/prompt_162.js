The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.ipv6', function(done) {
        const result = zod.z.ipv6();
        assert.deepStrictEqual(result, { type: "string", format: "ipv6" });
        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly deep-equal:
+ actual - expected

+ ZodIPv6 {
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
+     abort: false,
+     check: 'string_format',
+     format: 'ipv6',
+     pattern: /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})$/,
+     type: 'string'
+   },
+   default: [Function (anonymous)],
+   describe: [Function (anonymous)],
+   endsWith: [Function (anonymous)],
- {
    format: 'ipv6',
+   includes: [Function (anonymous)],
+   isNullable: [Function (anonymous)],
+   isOptional: [Function (anonymous)],
+   length: [Function (anonymous)],
+   lowercase: [Function (anonymous)],
+   max: [Function (anonymous)],
+   maxLength: null,
+   meta: [Function (anonymous)],
+   min: [Function (anonymous)],
+   minLength: null,
+   nonempty: [Function (anonymous)],
+   nonoptional: [Function (anonymous)],
+   normalize: [Function (anonymous)],
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
+   regex: [Function (anonymous)],
+   register: [Function (anonymous)],
+   safeParse: [Function (anonymous)],
+   safeParseAsync: [AsyncFunction (anonymous)],
+   spa: [AsyncFunction (anonymous)],
+   startsWith: [Function (anonymous)],
+   superRefine: [Function (anonymous)],
+   toLowerCase: [Function (anonymous)],
+   toUpperCase: [Function (anonymous)],
+   transform: [Function (anonymous)],
+   trim: [Function (anonymous)],
+   uppercase: [Function (anonymous)]
-   type: 'string'
  }
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.