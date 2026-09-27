The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.success', function(done) {
        // Use a simple value to pass to z.success
        const value = 'hello world';
        const result = zod.z.success(value);

        // The result should be an object with success:true and data equal to the original value
        assert.deepStrictEqual(result, { success: true, data: value });
        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly deep-equal:
+ actual - expected

+ ZodSuccess {
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
+     innerType: 'hello world',
+     type: 'success'
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
+   transform: [Function (anonymous)],
+   unwrap: [Function (anonymous)]
- {
-   data: 'hello world',
-   success: true
  }
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.