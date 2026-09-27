let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.intersection', function(done) {
        // Define two simple object schemas
        const Person = zod.object({ name: zod.string() });
        const Employee = zod.object({ role: zod.string() });

        // Create an intersection schema
        const EmployedPerson = zod.intersection(Person, Employee);

        // 1. Valid data should parse correctly
        const validInput = { name: 'Alice', role: 'Engineer' };
        const parsed = EmployedPerson.parse(validInput);
        assert.deepStrictEqual(parsed, validInput, 'Intersection should return the original object for valid input');

        // 2. Missing a property from either side should throw
        const missingName = { role: 'Engineer' };
        const missingRole = { name: 'Alice' };

        assert.throws(() => EmployedPerson.parse(missingName), zod.ZodError, 'Missing "name" should cause a validation error');
        assert.throws(() => EmployedPerson.parse(missingRole), zod.ZodError, 'Missing "role" should cause a validation error');

        // 3. Extra unknown keys are stripped (default behavior of z.object)
        const extraInput = { name: 'Bob', role: 'Manager', extra: 123 };
        const parsedExtra = EmployedPerson.parse(extraInput);
        // The result should not contain the extra key
        assert.deepStrictEqual(parsedExtra, { name: 'Bob', role: 'Manager' }, 'Extra keys should be stripped by default');

        done();
    });
});