The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nanoid', function(done) {
        // Ensure the nanoid function exists
        assert.ok(zod.z, 'zod.z should exist');
        assert.strictEqual(typeof zod.z.nanoid, 'function', 'zod.z.nanoid should be a function');

        // Test default nanoid generation
        const id = zod.z.nanoid();
        assert.strictEqual(typeof id, 'string', 'nanoid should return a string');
        assert.ok(id.length > 0, 'nanoid should not be empty');
        const pattern = /^[A-Za-z0-9_-]+$/;
        assert.ok(pattern.test(id), 'nanoid should contain only allowed characters');

        // Test nanoid generation with a custom length
        const length = 10;
        const id2 = zod.z.nanoid(length);
        assert.strictEqual(typeof id2, 'string', 'nanoid with length should return a string');
        assert.strictEqual(id2.length, length, `nanoid should have length ${length}`);
        assert.ok(pattern.test(id2), 'nanoid with length should contain only allowed characters');

        done();
    });
});
``` 
failed with the following error message:
```
nanoid should return a string

'object' !== 'string'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.