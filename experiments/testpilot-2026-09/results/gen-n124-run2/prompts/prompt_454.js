The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.success', function(done) {
        // create an inner type schema (any simple Zod schema works)
        const inner = zod.string();

        // invoke the function under test
        const result = zod.z.success(inner);

        // the returned object should be an instance of ZodSuccess
        assert.ok(result instanceof zod.ZodSuccess, 'result should be a ZodSuccess instance');

        // it should expose the same inner type we passed in
        assert.strictEqual(result.innerType, inner, 'innerType should be preserved');

        // the internal definition should indicate a success type
        // Depending on Zod version, the type information lives on the `_def` property
        if (result._def) {
            assert.strictEqual(result._def.type, 'success', 'def.type should be "success"');
        } else {
            // fallback check for older versions that expose the type directly
            assert.strictEqual(result.type, 'success', 'type should be "success"');
        }

        done();
    });
});
``` 
failed with the following error message:
```
innerType should be preserved
+ actual - expected

+ undefined
- ZodString {
-   '~standard': {
-     validate: [Function: validate],
-     vendor: 'zod',
-     version: 1
-   },
-   and: [Function (anonymous)],
-   array: [Function (anonymous)],
-   base64: [Function (anonymous)],
-   base64url: [Function (anonymous)],
-   brand: [Function (anonymous)],
-   catch: [Function (anonymous)],
-   check: [Function (anonymous)],
-   cidrv4: [Function (anonymous)],
-   cidrv6: [Function (anonymous)],
-   clone: [Function (anonymous)],
-   cuid2: [Function (anonymous)],
-   cuid: [Function (anonymous)],
-   date: [Function (anonymous)],
-   datetime: [Function (anonymous)],
-   def: {
-     type: 'string'
-   },
-   default: [Function (anonymous)],
-   describe: [Function (anonymous)],
-   duration: [Function (anonymous)],
-   e164: [Function (anonymous)],
-   email: [Function (anonymous)],
-   emoji: [Function (anonymous)],
-   endsWith: [Function (anonymous)],
-   format: null,
-   guid: [Function (anonymous)],
-   includes: [Function (anonymous)],
-   ipv4: [Function (anonymous)],
-   ipv6: [Function (anonymous)],
-   isNullable: [Function (anonymous)],
-   isOptional: [Function (anonymous)],
-   jwt: [Function (anonymous)],
-   ksuid: [Function (anonymous)],
-   length: [Function (anonymous)],
-   lowercase: [Function (anonymous)],
-   max: [Function (anonymous)],
-   maxLength: null,
-   meta: [Function (anonymous)],
-   min: [Function (anonymous)],
-   minLength: null,
-   nanoid: [Function (anonymous)],
-   nonempty: [Function (anonymous)],
-   nonoptional: [Function (anonymous)],
-   normalize: [Function (anonymous)],
-   nullable: [Function (anonymous)],
-   nullish: [Function (anonymous)],
-   optional: [Function (anonymous)],
-   or: [Function (anonymous)],
-   overwrite: [Function (anonymous)],
-   parse: [Function (anonymous)],
-   parseAsync: [AsyncFunction (anonymous)],
-   pipe: [Function (anonymous)],
-   prefault: [Function (anonymous)],
-   readonly: [Function (anonymous)],
-   refine: [Function (anonymous)],
-   regex: [Function (anonymous)],
-   register: [Function (anonymous)],
-   safeParse: [Function (anonymous)],
-   safeParseAsync: [AsyncFunction (anonymous)],
-   spa: [AsyncFunction (anonymous)],
-   startsWith: [Function (anonymous)],
-   superRefine: [Function (anonymous)],
-   time: [Function (anonymous)],
-   toLowerCase: [Function (anonymous)],
-   toUpperCase: [Function (anonymous)],
-   transform: [Function (anonymous)],
-   trim: [Function (anonymous)],
-   ulid: [Function (anonymous)],
-   uppercase: [Function (anonymous)],
-   url: [Function (anonymous)],
-   uuid: [Function (anonymous)],
-   uuidv4: [Function (anonymous)],
-   uuidv6: [Function (anonymous)],
-   uuidv7: [Function (anonymous)],
-   xid: [Function (anonymous)]
- }
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.