The test:
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.emoji', function(done) {
        // Create the emoji schema (no custom params needed for basic validation)
        const emojiSchema = zod.z.emoji();

        // ---- Positive test: a valid emoji should pass ----
        const validEmoji = '🚀';
        const parsed = emojiSchema.parse(validEmoji);
        assert.strictEqual(parsed, validEmoji, 'Valid emoji should be returned unchanged');

        // ---- Negative test: a non‑emoji string should throw a ZodError ----
        const invalidInput = 'not-an-emoji';
        try {
            emojiSchema.parse(invalidInput);
            // If we get here, validation failed to reject the input
            assert.fail('Expected a ZodError for non‑emoji input');
        } catch (err) {
            // Zod should throw a ZodError instance
            assert(err instanceof zod.ZodError, 'Error should be an instance of ZodError');
            // The error should contain at least one issue
            assert(Array.isArray(err.errors) && err.errors.length > 0, 'Error should contain validation issues');
        }

        // ---- Custom message test: ensure custom error message is used when provided ----
        const customMessage = 'Please provide a single emoji';
        const customEmojiSchema = zod.z.emoji({ message: customMessage });
        try {
            customEmojiSchema.parse('abc');
            assert.fail('Expected a ZodError with custom message');
        } catch (err) {
            assert(err instanceof zod.ZodError);
            // The first issue's message should match the custom message
            assert.strictEqual(err.errors[0].message, customMessage);
        }

        done();
    });
});
``` 
failed with the following error message:
```
Error should contain validation issues  
```

Your task is to modify the above code to fix the test. 

Provide your answer as a fenced code block.