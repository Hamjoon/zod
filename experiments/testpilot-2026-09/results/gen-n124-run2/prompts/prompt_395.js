The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.enum', function(done) {
        // basic enum validation
        const Colors = zod.enum(['red', 'green', 'blue']);
        // the enum should expose its options
        assert.deepStrictEqual(Colors.options, ['red', 'green', 'blue']);
        // valid values are parsed unchanged
        assert.strictEqual(Colors.parse('red'), 'red');
        assert.strictEqual(Colors.parse('green'), 'green');
        // invalid values throw
        assert.throws(() => Colors.parse('yellow'), /Invalid enum value/);

        // enum used inside a template literal
        const cssUnits = zod.enum(['px', 'em', 'rem', '%']);
        const css = zod.templateLiteral([zod.number(), cssUnits]);

        // valid template literal strings are parsed
        assert.strictEqual(css.parse('12px'), '12px');
        assert.strictEqual(css.parse('0.5em'), '0.5em');
        assert.strictEqual(css.parse('100%'), '100%');

        // invalid unit should cause a validation error
        assert.throws(() => css.parse('12pt'), /Invalid enum value/);

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Invalid enum value/. Input:

'[\n' +
  '  {\n' +
  '    "code": "invalid_value",\n' +
  '    "values": [\n' +
  '      "red",\n' +
  '      "green",\n' +
  '      "blue"\n' +
  '    ],\n' +
  '    "path": [],\n' +
  '    "message": "Invalid option: expected one of \\"red\\"|\\"green\\"|\\"blue\\""\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.