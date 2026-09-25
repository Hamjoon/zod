let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.stringFormat', function(done) {
        // --- Test using a RegExp as the validator ---
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const EmailSchema = zod.z.stringFormat('email', emailRegex);

        // Valid email should pass
        assert.doesNotThrow(() => EmailSchema.parse('user@example.com'));

        // Invalid email should throw a ZodError
        assert.throws(() => EmailSchema.parse('not-an-email'));

        // --- Test using a function as the validator ---
        const isUpperCase = (s) => s === s.toUpperCase();
        const UpperCaseSchema = zod.z.stringFormat('uppercase', isUpperCase);

        // Upper‑case string should pass
        assert.doesNotThrow(() => UpperCaseSchema.parse('HELLO'));

        // Non‑upper‑case string should throw
        assert.throws(() => UpperCaseSchema.parse('Hello'));

        done();
    });
});