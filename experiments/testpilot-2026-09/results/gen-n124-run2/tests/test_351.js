let mocha = require('mocha');
let assert = require('assert');
const { z } = require('zod'); // use the proper Zod namespace

describe('test zod', function () {
    it('test zod.z.intersection', function (done) {
        // Define two simple object schemas (allow extra keys)
        const Person = z.object({ name: z.string() }).passthrough();
        const Employee = z.object({ role: z.string() }).passthrough();

        // Create an intersection schema (Person & Employee)
        const EmployedPerson = z.intersection(Person, Employee);

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