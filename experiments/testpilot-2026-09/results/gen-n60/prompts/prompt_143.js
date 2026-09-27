The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.looseObject', function(done) {
        // Define a simple shape
        const shape = {
            name: zod.string()
        };

        // Create a loose object schema
        const schema = zod.z.looseObject(shape);

        // The schema should be an instance of ZodObject
        assert(schema instanceof zod.ZodObject, 'schema is not a ZodObject');

        // Valid object: contains required field and extra unknown fields
        const valid = schema.safeParse({ name: 'Alice', extra: 123 });
        assert.strictEqual(valid.success, true, 'valid object should pass');

        // Invalid object: missing required field
        const invalid = schema.safeParse({ extra: 123 });
        assert.strictEqual(invalid.success, false, 'object missing required field should fail');

        // Ensure extra fields are allowed (catchall is unknown)
        const extraAllowed = schema.safeParse({ name: 'Bob', another: 'value' });
        assert.strictEqual(extraAllowed.success, true, 'object with extra fields should pass');

        // Test that the shape getter works and returns a copy of the shape
        const retrievedShape = schema.shape;
        assert.deepStrictEqual(retrievedShape, shape, 'retrieved shape should match original shape');
        // Mutating the retrieved shape should not affect the original schema's shape
        retrievedShape.newProp = zod.number();
        assert.strictEqual(schema.shape.newProp, undefined, 'schema shape should not be mutated by external changes');

        done();
    });
});
``` 
failed with the following error message:
```
schema shape should not be mutated by external changes
+ actual - expected

+ ZodNumber {
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
+     checks: [],
+     type: 'number'
+   },
+   default: [Function (anonymous)],
+   describe: [Function (anonymous)],
+   finite: [Function (anonymous)],
+   format: null,
+   gt: [Function (anonymous)],
+   gte: [Function (anonymous)],
+   int: [Function (anonymous)],
+   isFinite: true,
+   isInt: false,
+   isNullable: [Function (anonymous)],
+   isOptional: [Function (anonymous)],
+   lt: [Function (anonymous)],
+   lte: [Function (anonymous)],
+   max: [Function (anonymous)],
+   maxValue: Infinity,
+   meta: [Function (anonymous)],
+   min: [Function (anonymous)],
+   minValue: -Infinity,
+   multipleOf: [Function (anonymous)],
+   negative: [Function (anonymous)],
+   nonnegative: [Function (anonymous)],
+   nonoptional: [Function (anonymous)],
+   nonpositive: [Function (anonymous)],
+   nullable: [Function (anonymous)],
+   nullish: [Function (anonymous)],
+   optional: [Function (anonymous)],
+   or: [Function (anonymous)],
+   overwrite: [Function (anonymous)],
+   parse: [Function (anonymous)],
+   parseAsync: [AsyncFunction (anonymous)],
+   pipe: [Function (anonymous)],
+   positive: [Function (anonymous)],
+   prefault: [Function (anonymous)],
+   readonly: [Function (anonymous)],
+   refine: [Function (anonymous)],
+   register: [Function (anonymous)],
+   safe: [Function (anonymous)],
+   safeParse: [Function (anonymous)],
+   safeParseAsync: [AsyncFunction (anonymous)],
+   spa: [AsyncFunction (anonymous)],
+   step: [Function (anonymous)],
+   superRefine: [Function (anonymous)],
+   transform: [Function (anonymous)]
+ }
- undefined
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.