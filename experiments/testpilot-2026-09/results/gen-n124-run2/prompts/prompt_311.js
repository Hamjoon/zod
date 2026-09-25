The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.keyof', function(done) {
        // Define a simple object schema
        const Dog = zod.object({
            name: zod.string(),
            age: zod.number()
        });

        // Call .keyof via the instance method and the static helper
        const keySchema1 = Dog.keyof();      // instance method
        const keySchema2 = zod.keyof(Dog);   // static helper

        // Both results should be ZodEnum instances
        assert(keySchema1 instanceof zod.ZodEnum, 'Dog.keyof() should return a ZodEnum');
        assert(keySchema2 instanceof zod.ZodEnum, 'zod.keyof(Dog) should return a ZodEnum');

        // The enum values should match the object keys
        const expected = ['name', 'age'];
        // ZodEnum stores its values in the internal _def.values array
        assert.deepStrictEqual(keySchema1._def.values.sort(), expected.sort(),
            'Dog.keyof() enum values are incorrect');
        assert.deepStrictEqual(keySchema2._def.values.sort(), expected.sort(),
            'zod.keyof(Dog) enum values are incorrect');

        done();
    });
});
``` 
failed with the following error message:
```
zod.keyof(Dog) should return a ZodEnum  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.