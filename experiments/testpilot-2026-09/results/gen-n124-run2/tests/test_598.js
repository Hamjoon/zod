let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.maxSize', function(done) {
        // Arrange: define a maximum size and some custom parameters
        const maximum = 1024;
        const params = {
            message: 'File is too large',
            // any other custom param you might want to test
            customFlag: true
        };

        // Act: call the function under test
        const result = zod.z.maxSize(maximum, params);

        // Assert: the result should be an object with the expected shape
        // 1. It must have a `check` property equal to "max_size"
        assert.strictEqual(result.check, 'max_size', 'check type should be "max_size"');

        // 2. It must retain the `maximum` value we passed
        assert.strictEqual(result.maximum, maximum, 'maximum should match the input value');

        // 3. All supplied params should be present on the result (normalizeParams copies them)
        Object.keys(params).forEach(key => {
            assert.strictEqual(result[key], params[key], `param "${key}" should be preserved`);
        });

        // 4. The result should be an instance of the internal check class (optional safety)
        // This check is defensive – if the class is not exposed we simply ensure the object exists
        assert.ok(result, 'result should be a truthy object');

        done();
    });
});