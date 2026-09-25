The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.ipv4', function(done) {
        // obtain the ipv4 schema
        const schema = zod.z.ipv4();

        // the schema should describe a string with ipv4 format
        assert.deepStrictEqual(schema, { type: "string", format: "ipv4" });

        // if the schema provides a validation method, test a couple of values
        if (typeof schema.validate === 'function') {
            // a valid IPv4 address should pass
            assert.strictEqual(schema.validate('192.168.0.1'), true);
            // an obviously invalid IPv4 address should fail
            assert.strictEqual(schema.validate('999.999.999.999'), false);
        }

        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly deep-equal:
+ actual - expected

+ ZodIPv4 {
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
+     format: 'ipv4',
+     pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
+     type: 'string'
+   },
+   default: [Function (anonymous)],
+   describe: [Function (anonymous)],
+   endsWith: [Function (anonymous)],
- {
    format: 'ipv4',
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