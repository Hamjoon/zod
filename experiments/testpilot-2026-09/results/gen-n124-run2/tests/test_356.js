let mocha = require('mocha');
let assert = require('assert');
const { z } = require('zod'); // <-- use the exported `z` object

describe('test zod', function() {
    it('test zod.z.tuple', function(done) {
        // Simple fixed‑length tuple: [string, number]
        const tupleSchema = z.tuple([z.string(), z.number()]);

        // Valid input should parse correctly
        const valid = ['hello', 123];
        const parsed = tupleSchema.parse(valid);
        assert.deepStrictEqual(parsed, valid, 'Tuple should parse valid input');

        // Invalid length (too short)
        assert.throws(() => {
            tupleSchema.parse(['only one']);
        }, /tuple of length 2/, 'Tuple should reject input with wrong length');

        // Invalid type for second element
        assert.throws(() => {
            tupleSchema.parse(['hello', 'not a number']);
        }, /Expected number/, 'Tuple should reject input with wrong element type');

        // Tuple with a rest schema: first element string, then any number of numbers
        const restTupleSchema = z.tuple([z.string()], z.number());

        // Valid input with rest elements
        const restValid = ['first', 1, 2, 3];
        const restParsed = restTupleSchema.parse(restValid);
        assert.deepStrictEqual(restParsed, restValid, 'Rest tuple should parse valid input');

        // Invalid rest element (non‑number)
        assert.throws(() => {
            restTupleSchema.parse(['first', 1, 'bad']);
        }, /Expected number/, 'Rest tuple should reject non‑number in rest part');

        // Invalid first element (not a string)
        assert.throws(() => {
            restTupleSchema.parse([42, 1, 2]);
        }, /Expected string/, 'Rest tuple should reject wrong first element type');

        done();
    });
});