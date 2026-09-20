The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.keyof', function(done) {
        // define a simple object schema
        const Dog = zod.object({
            name: zod.string(),
            age: zod.number()
        });

        // 1️⃣ use the instance method .keyof()
        const keySchemaInst = Dog.keyof();               // ZodEnum<["name","age"]>
        // ensure we got a ZodEnum instance
        assert(keySchemaInst instanceof zod.ZodEnum, 'Dog.keyof() should return a ZodEnum');
        // the enum values should match the object keys (order is not guaranteed)
        assert.deepStrictEqual(
            keySchemaInst._def.values.sort(),
            ['name', 'age'].sort(),
            'Dog.keyof() enum values are incorrect'
        );
        // parsing a valid key should succeed
        assert.strictEqual(keySchemaInst.parse('name'), 'name');

        // 2️⃣ use the static helper zod.z.keyof(schema)
        const keySchemaStatic = zod.z.keyof(Dog);        // ZodEnum<["name","age"]>
        assert(keySchemaStatic instanceof zod.ZodEnum, 'zod.z.keyof should return a ZodEnum');
        assert.deepStrictEqual(
            keySchemaStatic._def.values.sort(),
            ['name', 'age'].sort(),
            'zod.z.keyof enum values are incorrect'
        );
        // parsing a valid key should also succeed
        assert.strictEqual(keySchemaStatic.parse('age'), 'age');

        done();
    });
});
``` 
failed with the following error message:
```
Cannot read properties of undefined (reading 'sort')  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.