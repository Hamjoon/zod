The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.symbol', function(done) {
        // Create a Zod symbol schema
        const schema = zod.z.symbol();

        // The schema should be an instance of ZodSymbol
        assert(schema instanceof zod.ZodSymbol, 'schema should be an instance of ZodSymbol');

        // Valid symbol should parse correctly
        const sym = Symbol('test');
        const parsed = schema.parse(sym);
        assert.strictEqual(parsed, sym, 'parsed value should be the original Symbol');

        // Invalid (non‑symbol) values should throw a ZodError
        assert.throws(
            () => schema.parse('not a symbol'),
            /Expected symbol/
        );

        done();
    });
});
``` 
failed with the following error message:
```
The input did not match the regular expression /Expected symbol/. Input:

'[\n' +
  '  {\n' +
  '    "expected": "symbol",\n' +
  '    "code": "invalid_type",\n' +
  '    "path": [],\n' +
  '    "message": "Invalid input: expected symbol, received string"\n' +
  '  }\n' +
  ']'
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.