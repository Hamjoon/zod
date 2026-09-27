let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.instanceof', function(done) {
        // A simple class to test against
        class MyClass {
            constructor() {
                this.value = 42;
            }
        }

        // Schema that validates instances of MyClass with the default error message
        const defaultSchema = zod.z.instanceof(MyClass);

        // Should succeed when given a proper instance
        const instance = new MyClass();
        const parsed = defaultSchema.parse(instance);
        assert(parsed instanceof MyClass, 'Parsed value should be an instance of MyClass');

        // Should fail with the default error message when given a non‑instance
        assert.throws(
            () => defaultSchema.parse({}),
            /Input not instance of MyClass/,
            'Should throw default error when input is not an instance of MyClass'
        );

        // Schema that validates instances of MyClass with a custom error message
        const customSchema = zod.z.instanceof(MyClass, { error: 'Custom error message' });

        // Should fail with the custom error message
        assert.throws(
            () => customSchema.parse([]),
            /Custom error message/,
            'Should throw custom error when input is not an instance of MyClass'
        );

        done();
    });
});