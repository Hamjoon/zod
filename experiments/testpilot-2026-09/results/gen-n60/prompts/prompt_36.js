The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.map', function(done) {
        // Create a map schema with string keys and number values
        const schema = zod.z.map(zod.z.string(), zod.z.number());

        // ---- Positive test: a valid Map should parse successfully ----
        const validMap = new Map([['foo', 42], ['bar', 7]]);
        const parsed = schema.parse(validMap);
        // Zod returns the original value for maps, so we can compare by reference
        assert.strictEqual(parsed, validMap);

        // ---- Negative test: wrong key type (number instead of string) ----
        const badKeyMap = new Map([[123, 1]]);
        assert.throws(() => schema.parse(badKeyMap), /Expected string/);

        // ---- Negative test: wrong value type (string instead of number) ----
        const badValueMap = new Map([['baz', 'not-a-number']]);
        assert.throws(() => schema.parse(badValueMap), /Expected number/);

        done();
    });
});
``` 
failed with the following error message:
```
Values have same structure but are not reference-equal:

Map(2) {
  'bar' => 7,
  'foo' => 42
}
  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.