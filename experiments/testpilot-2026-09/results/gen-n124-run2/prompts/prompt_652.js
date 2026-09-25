The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.regex', function(done) {
        // simple pattern without extra params
        const pattern = /hello/;
        const check = zod.z.regex(pattern);

        // basic shape checks
        assert.strictEqual(typeof check, 'object', 'regex should return an object');
        assert.strictEqual(check.check, 'string_format', 'check type should be string_format');
        assert.strictEqual(check.format, 'regex', 'format should be regex');
        assert.strictEqual(check.pattern, pattern, 'pattern should be preserved');

        // pattern with additional params should be merged
        const extra = { message: 'Invalid format' };
        const checkWithParams = zod.z.regex(pattern, extra);
        assert.strictEqual(checkWithParams.message, extra.message, 'extra params should be merged into the check');

        done();
    });
});
``` 
failed with the following error message:
```
check type should be string_format
+ actual - expected

+ undefined
- 'string_format'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.