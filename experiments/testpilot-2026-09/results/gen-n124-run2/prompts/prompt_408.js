The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.file', function(done) {
        // Create a file schema with default parameters
        const schema = zod.z.file({});

        // The returned object should behave like a Zod schema
        assert.ok(typeof schema.parse === 'function', 'schema should have a parse method');
        assert.ok(schema._def && schema._def.typeName === 'ZodFile', 'schema _def.typeName should be ZodFile');

        // Mock a simple file‑like object to validate the schema
        const mockFile = { name: 'example.txt', size: 42 };
        const parsed = schema.parse(mockFile);

        // The schema should return the original value when validation passes
        assert.deepStrictEqual(parsed, mockFile, 'parsed value should equal the input');

        done();
    });
});
``` 
failed with the following error message:
```
schema _def.typeName should be ZodFile  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.