The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.cidrv6', function(done) {
        // Create the CIDR v6 schema (no parameters needed for basic validation)
        const schema = zod.z.cidrv6();

        // A valid IPv6 CIDR should pass without throwing
        assert.doesNotThrow(() => {
            schema.parse('2001:0db8:85a3:0000:0000:8a2e:0370:7334/64');
        }, 'Valid IPv6 CIDR should not throw');

        // An invalid value should cause a Zod validation error
        assert.throws(() => {
            schema.parse('invalid-cidr');
        }, /ZodError/, 'Invalid CIDR should throw a ZodError');

        done();
    });
});
``` 
failed with the following error message:
```
Invalid CIDR should throw a ZodError  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.