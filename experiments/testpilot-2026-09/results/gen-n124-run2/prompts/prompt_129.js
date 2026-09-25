The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.cuid', function(done) {
        // A valid CUID: starts with 'c' followed by 24 lower‑case alphanumeric characters
        const validCuid = 'c' + 'a'.repeat(24); // e.g. "caaaaaaaaaaaaaaaaaaaaaaaa"
        // The schema should return the same value when the input is valid
        const result = zod.z.cuid(validCuid);
        assert.strictEqual(result, validCuid, 'Valid CUID should be returned unchanged');

        // An invalid CUID should cause Zod to throw a validation error
        const invalidCuid = 'not-a-cuid';
        assert.throws(() => {
            zod.z.cuid(invalidCuid);
        }, /ZodError/, 'Invalid CUID should throw a ZodError');

        done();
    });
});
``` 
failed with the following error message:
```
Valid CUID should be returned unchanged
+ actual - expected

+ ZodCUID {
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
+     error: [Function: error],
+     format: 'cuid',
+     pattern: /^[cC][^\s-]{8,}$/,
+     type: 'string'
+   },
+   default: [Function (anonymous)],
+   describe: [Function (anonymous)],
+   endsWith: [Function (anonymous)],
+   format: 'cuid',
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
+ }
- 'caaaaaaaaaaaaaaaaaaaaaaaa'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.