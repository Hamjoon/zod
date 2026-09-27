The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.guid', function(done) {
        // Generate two GUIDs
        const guid1 = zod.z.guid();
        const guid2 = zod.z.guid();

        // Verify they are strings
        assert.strictEqual(typeof guid1, 'string');
        assert.strictEqual(typeof guid2, 'string');

        // Verify they match the standard GUID/UUID format
        const guidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        assert.ok(guidPattern.test(guid1), 'guid1 does not match UUID pattern');
        assert.ok(guidPattern.test(guid2), 'guid2 does not match UUID pattern');

        // Verify that two successive calls produce different values
        assert.notStrictEqual(guid1, guid2, 'Two generated GUIDs should not be equal');

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