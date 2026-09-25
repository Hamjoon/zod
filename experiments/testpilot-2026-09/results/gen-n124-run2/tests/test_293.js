let mocha = require('mocha');
let assert = require('assert');
let { z } = require('zod');            // <-- use the proper import
describe('test zod', function () {
    it('test zod.z.date', function (done) {
        // Create a basic date schema
        const schema = z.date();

        // Parsing a valid Date should succeed and return the same instance
        const now = new Date();
        const parsed = schema.parse(now);
        assert.strictEqual(parsed, now, 'Parsed date should be the same instance');

        // Parsing an invalid type should throw a ZodError
        // NOTE: Zod reports an *invalid‑type* error for a string, e.g.
        // "Expected date, received string".  The original test looked for
        // "Invalid date", which is only used when a Date instance is
        // invalid (e.g. new Date('invalid')).  Adjust the regex to match
        // the actual message.
        assert.throws(
            () => {
                schema.parse('2020-01-01');
            },
            /Expected date/,                     // <-- updated matcher
            'String should not be accepted as a date'
        );

        // Create a date schema with custom error messages via params
        const schemaWithMessage = z.date({
            required_error: 'Date required',
            invalid_type_error: 'Not a date',
        });

        // Missing value should trigger the required_error
        assert.throws(
            () => {
                schemaWithMessage.parse(undefined);
            },
            /Date required/,
            'Missing value should produce the custom required_error'
        );

        // Invalid type should trigger the invalid_type_error
        assert.throws(
            () => {
                schemaWithMessage.parse(123);
            },
            /Not a date/,
            'Invalid type should produce the custom invalid_type_error'
        );

        done();
    });
});