The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.trim', function(done) {
        // Create a string schema that disallows leading/trailing whitespace
        const schema = zod.z.string().trim();

        // Valid case – no surrounding whitespace
        assert.doesNotThrow(() => schema.parse('hello'));

        // Invalid cases – leading or trailing whitespace should cause a validation error
        assert.throws(() => schema.parse(' hello'), /Invalid/);
        assert.throws(() => schema.parse('hello '), /Invalid/);
        assert.throws(() => schema.parse('  hello  '), /Invalid/);

        done();
    });
});
``` 
failed with the following error message:
```
Missing expected exception.  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.