The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.email', function(done) {
        // Valid email addresses should return true
        const validEmails = [
            'test@example.com',
            'user.name+tag+sorting@example.com',
            'x@x.x',
            'firstname.lastname@domain.co',
            'email@subdomain.example.com'
        ];
        validEmails.forEach(email => {
            assert.strictEqual(zod.z.email(email), true, `${email} should be considered a valid email`);
        });

        // Invalid email addresses should return false
        const invalidEmails = [
            'plainaddress',
            '@missingusername.com',
            'username@.com',
            'username@com',
            'username@domain..com',
            'username@domain,com',
            'username@ domain.com',
            'username@domain.com (Joe Smith)'
        ];
        invalidEmails.forEach(email => {
            assert.strictEqual(zod.z.email(email), false, `${email} should be considered an invalid email`);
        });

        done();
    });
});
``` 
failed with the following error message:
```
test@example.com should be considered a valid email
+ actual - expected

+ ZodEmail {
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
+     format: 'email',
+     pattern: /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,
+     type: 'string'
+   },
+   default: [Function (anonymous)],
+   describe: [Function (anonymous)],
+   endsWith: [Function (anonymous)],
+   format: 'email',
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
- true
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.