The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.templateLiteral', function(done) {
        // Create a template literal schema that matches strings like "hello <any string>!"
        const schema = zod.z.templateLiteral(['hello ', '!'], [zod.z.string()]);

        // Should accept a valid string
        assert.doesNotThrow(() => {
            schema.parse('hello world!');
        });

        // Should reject strings that do not follow the template
        assert.throws(() => {
            schema.parse('hi world!');
        });

        // Should also reject when the interpolated part is missing
        assert.throws(() => {
            schema.parse('hello !');
        });

        done();
    });
});
``` 
failed with the following error message:
```
Got unwanted exception.
Actual message: "[
  {
    "code": "invalid_format",
    "format": "template_literal",
    "pattern": "^hello !$",
    "path": [],
    "message": "Invalid input"
  }
]"  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.