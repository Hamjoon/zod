The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.uppercase', function(done) {
        const input = 'Hello World';
        const result = zod.z.uppercase(input);
        assert.strictEqual(result, 'HELLO WORLD');
        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly equal:
+ actual - expected

+ $ZodCheckUpperCase {}
- 'HELLO WORLD'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.