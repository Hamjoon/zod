The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.enum', function(done) {
        const { z } = zod;

        // Basic enum creation and parsing
        const Fruit = z.enum(['Apple', 'Banana', 'Cherry']);
        assert.strictEqual(Fruit.parse('Apple'), 'Apple');
        assert.strictEqual(Fruit.parse('Banana'), 'Banana');

        // Invalid value should throw a ZodError
        assert.throws(() => Fruit.parse('Durian'), /Invalid enum value/);

        // Internal entries map should be correctly built
        assert.deepStrictEqual(Fruit._def.entries, {
            Apple: 'Apple',
            Banana: 'Banana',
            Cherry: 'Cherry',
        });

        // Enum used inside a template literal
        const CssUnits = z.enum(['px', 'em', 'rem', '%']);
        const Css = z.templateLiteral([z.number(), CssUnits]);

        // Valid template literal strings
        assert.strictEqual(Css.parse('10px'), '10px');
        assert.strictEqual(Css.parse('5%'), '5%');
        assert.strictEqual(Css.parse('12rem'), '12rem');

        // Invalid template literal should throw
        assert.throws(() => Css.parse('7pt'), /Invalid input/);

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
  '      "Apple",\n' +
  '      "Banana",\n' +
  '      "Cherry"\n' +
  '    ],\n' +
  '    "path": [],\n' +
  '    "message": "Invalid option: expected one of \\"Apple\\"|\\"Banana\\"|\\"Cherry\\""\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.