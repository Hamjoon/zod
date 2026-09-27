// test-zod-gte.js
const mocha = require('mocha');
const { describe, it } = mocha;
const assert = require('assert');
const { z } = require('zod'); // <-- import the Zod namespace correctly

describe('test zod', function () {
    it('test z.gte', function (done) {
        // Create a schema that validates numbers greater than or equal to 5
        const schema = z.number().gte(5); // <-- proper Zod schema

        // Values that should pass validation
        try {
            schema.parse(5);   // exactly the boundary
            schema.parse(10);  // above the boundary
        } catch (e) {
            return done(new Error('Valid values threw an error: ' + e.message));
        }

        // Values that should fail validation
        const shouldFail = [4, -1, 0, 3.999];
        for (const val of shouldFail) {
            try {
                schema.parse(val);
                return done(new Error(`Invalid value ${val} did not throw an error`));
            } catch (e) {
                // Expected to throw – optionally check the error message contains "gte"
                // Zod error messages may vary, so we just ensure an error was thrown.
                // If you want to be stricter you can uncomment the following:
                // if (!/gte/.test(e.message)) {
                //     return done(new Error(`Error message for ${val} does not mention "gte": ${e.message}`));
                // }
            }
        }

        // If we reach here, all assertions passed
        done();
    });
});