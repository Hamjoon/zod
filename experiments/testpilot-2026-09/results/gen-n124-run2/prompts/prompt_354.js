The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.intersection', function(done) {
        // Define two simple object schemas
        const Person = zod.object({ name: zod.string() });
        const Employee = zod.object({ role: zod.string() });

        // Create an intersection schema (Person & Employee)
        const EmployedPerson = zod.intersection(Person, Employee);

        // A valid object should parse successfully
        const valid = { name: 'Alice', role: 'Developer' };
        const parsed = EmployedPerson.parse(valid);
        assert.deepStrictEqual(parsed, valid, 'Valid intersection object should be parsed unchanged');

        // Missing a property from the left schema should throw
        assert.throws(() => {
            EmployedPerson.parse({ role: 'Developer' });
        }, /Required/, 'Missing "name" should cause a validation error');

        // Missing a property from the right schema should throw
        assert.throws(() => {
            EmployedPerson.parse({ name: 'Alice' });
        }, /Required/, 'Missing "role" should cause a validation error');

        // Extra properties are allowed by default (Zod's strictness is not enforced here)
        const extra = { name: 'Bob', role: 'Manager', department: 'Sales' };
        const parsedExtra = EmployedPerson.parse(extra);
        assert.deepStrictEqual(parsedExtra, extra, 'Extra properties should be retained');

        done();
    });
});
``` 
failed with the following error message:
```
Missing "name" should cause a validation error  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.