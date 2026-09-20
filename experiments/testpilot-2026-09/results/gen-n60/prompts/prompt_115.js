The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.templateLiteral', function(done) {
        // Create a template literal schema: "hello " + <string> + "!"
        const schema = zod.z.templateLiteral(['hello ', '!'], [zod.z.string()]);

        // Verify internal definition
        assert.strictEqual(schema._def.type, 'template_literal');
        assert.deepStrictEqual(schema._def.parts, ['hello ', '!']);

        // Valid value should parse correctly
        const valid = 'hello world!';
        const parsed = schema.parse(valid);
        assert.strictEqual(parsed, valid);

        // Invalid value should throw a ZodError
        assert.throws(() => schema.parse('hi world!'), zod.ZodError);

        done();
    });
});
``` 
failed with the following error message:
```
[
  {
    "code": "invalid_format",
    "format": "template_literal",
    "pattern": "^hello !$",
    "path": [],
    "message": "Invalid input"
  }
]  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.