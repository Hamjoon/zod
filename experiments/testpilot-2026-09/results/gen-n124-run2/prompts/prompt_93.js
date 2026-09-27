The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.uuid', function(done) {
        // 1. Verify the generated JSON schema shape
        const schema = zod.z.uuid();
        assert.deepStrictEqual(schema, { type: "string", format: "uuid" });

        // 2. Verify runtime validation works as expected
        const uuidValidator = zod.string().uuid();

        // a) Valid UUID should pass
        const validUuid = "123e4567-e89b-12d3-a456-426614174000";
        assert.doesNotThrow(() => uuidValidator.parse(validUuid));

        // b) Invalid UUID should throw a ZodError
        const invalidUuid = "not-a-valid-uuid";
        assert.throws(() => uuidValidator.parse(invalidUuid));

        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly deep-equal:
+ actual - expected

+ ZodUUID {
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
+     format: 'uuid',
+     pattern: /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$/,
+     type: 'string'
+   },
+   default: [Function (anonymous)],
+   describe: [Function (anonymous)],
+   endsWith: [Function (anonymous)],
- {
    format: 'uuid',
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