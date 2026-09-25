The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.base64url', function(done) {
        // A valid Base64URL string (no padding, URL‑safe characters only)
        const validBase64Url = 'SGVsbG8tV29ybGQ'; // "Hello-World" in base64url

        // The function should return the input unchanged for a valid value
        assert.doesNotThrow(() => {
            const parsed = zod.z.base64url(validBase64Url);
            assert.strictEqual(parsed, validBase64Url);
        }, 'Valid Base64URL string should not throw');

        // An invalid Base64URL string (contains illegal characters)
        const invalidBase64Url = 'Invalid!!@@';

        // The function should throw a ZodError for an invalid value
        assert.throws(() => {
            zod.z.base64url(invalidBase64Url);
        }, /ZodError/, 'Invalid Base64URL string should throw a ZodError');

        done();
    });
});
``` 
failed with the following error message:
```
Got unwanted exception: Valid Base64URL string should not throw
Actual message: "Expected values to be strictly equal:
+ actual - expected

+ ZodBase64URL {
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
+     format: 'base64url',
+     pattern: /^[A-Za-z0-9_-]*$/,
+     type: 'string'
+   },
+   default: [Function (anonymous)],
+   describe: [Function (anonymous)],
+   endsWith: [Function (anonymous)],
+   format: 'base64url',
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
- 'SGVsbG8tV29ybGQ'
"  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.