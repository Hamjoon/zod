The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nanoid', function(done) {
        // Generate two IDs with default settings
        const id1 = zod.z.nanoid();
        const id2 = zod.z.nanoid();

        // Both should be strings
        assert.strictEqual(typeof id1, 'string');
        assert.strictEqual(typeof id2, 'string');

        // They should be different (high probability)
        assert.notStrictEqual(id1, id2);

        // Default nanoid length is 21 characters (the typical nanoid default)
        assert.strictEqual(id1.length, 21);
        assert.strictEqual(id2.length, 21);

        // Generate an ID with a custom length
        const customLength = 10;
        const customId = zod.z.nanoid({ length: customLength });

        // The custom ID should have the requested length
        assert.strictEqual(customId.length, customLength);
        assert.strictEqual(typeof customId, 'string');

        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly equal:

'object' !== 'string'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.