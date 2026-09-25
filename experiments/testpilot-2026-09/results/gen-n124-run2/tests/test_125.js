let mocha = require('mocha');
let assert = require('assert');
let { nanoid } = require('nanoid');   // <-- use the actual nanoid implementation

describe('test nanoid', function () {
    it('test nanoid generation', function (done) {
        // Ensure the nanoid function exists
        assert.ok(nanoid, 'nanoid should exist');
        assert.strictEqual(typeof nanoid, 'function', 'nanoid should be a function');

        // Test default nanoid generation
        const id = nanoid();
        assert.strictEqual(typeof id, 'string', 'nanoid should return a string');
        assert.ok(id.length > 0, 'nanoid should not be empty');
        const pattern = /^[A-Za-z0-9_-]+$/;
        assert.ok(pattern.test(id), 'nanoid should contain only allowed characters');

        // Test nanoid generation with a custom length
        const length = 10;
        const id2 = nanoid(length);
        assert.strictEqual(typeof id2, 'string', 'nanoid with length should return a string');
        assert.strictEqual(id2.length, length, `nanoid should have length ${length}`);
        assert.ok(pattern.test(id2), 'nanoid with length should contain only allowed characters');

        done();
    });
});