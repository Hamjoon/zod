The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.coerce.boolean', function(done) {
        // Valid coercions
        assert.strictEqual(zod.z.coerce.boolean('true'), true);
        assert.strictEqual(zod.z.coerce.boolean('false'), false);
        assert.strictEqual(zod.z.coerce.boolean(1), true);
        assert.strictEqual(zod.z.coerce.boolean(0), false);
        // Invalid coercion should throw
        assert.throws(() => zod.z.coerce.boolean('yes'));
        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly equal:
+ actual - expected

+ ZodBoolean {
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
+     coerce: true,
+     error: [Function: error],
+     type: 'boolean'
+   },
+   default: [Function (anonymous)],
+   describe: [Function (anonymous)],
+   isNullable: [Function (anonymous)],
+   isOptional: [Function (anonymous)],
+   meta: [Function (anonymous)],
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
+ }
- true
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.