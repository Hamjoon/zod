let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.check', function(done) {
        // Create a schema with a custom check that limits length and forbids duplicates
        const UniqueStringArray = zod.z
            .array(zod.z.string())
            .check((ctx) => {
                // Too many items
                if (ctx.value.length > 3) {
                    ctx.issues.push({
                        code: "too_big",
                        message: "Too many items",
                        input: ctx.value,
                    });
                }
                // Duplicates not allowed
                if (ctx.value.length !== new Set(ctx.value).size) {
                    ctx.issues.push({
                        code: "custom",
                        message: "No duplicates allowed.",
                        input: ctx.value,
                    });
                }
            });

        // ---- Valid case -------------------------------------------------
        assert.doesNotThrow(() => {
            UniqueStringArray.parse(['a', 'b', 'c']);
        }, "Valid array should not throw");

        // ---- Duplicate case -----------------------------------------------
        try {
            UniqueStringArray.parse(['a', 'b', 'a']);
            assert.fail('Expected duplicate check to throw');
        } catch (e) {
            const issues = e.issues || e.errors || [];
            const hasDuplicateIssue = issues.some(
                (iss) => iss.message && iss.message.includes('No duplicates')
            );
            assert.ok(hasDuplicateIssue, 'Duplicate issue should be reported');
        }

        // ---- Too many items case -------------------------------------------
        try {
            UniqueStringArray.parse(['a', 'b', 'c', 'd']);
            assert.fail('Expected length check to throw');
        } catch (e) {
            const issues = e.issues || e.errors || [];
            const hasTooBigIssue = issues.some(
                (iss) => iss.message && iss.message.includes('Too many')
            );
            assert.ok(hasTooBigIssue, 'Too many items issue should be reported');
        }

        done();
    });
});