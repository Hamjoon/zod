The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.normalize', function(done) {
        // Sample input form with whitespace, string numbers and an empty field
        const form = {
            name: '  Alice  ',
            age: '30',
            empty: ''
        };

        // Expected normalized output:
        // - strings are trimmed
        // - numeric strings are converted to numbers
        // - empty values are removed
        const expected = {
            name: 'Alice',
            age: 30
        };

        // Call the function under test
        const result = zod.z.normalize(form);

        // Verify that the result matches the expected normalized object
        assert.deepStrictEqual(result, expected);

        done();
    });
});
``` 
failed with the following error message:
```
Expected values to be strictly deep-equal:
+ actual - expected

+ $ZodCheckOverwrite {}
- {
-   age: 30,
-   name: 'Alice'
- }
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.