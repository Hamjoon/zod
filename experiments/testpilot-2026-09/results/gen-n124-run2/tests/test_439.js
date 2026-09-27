let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.prefault', function(done) {
        // 1️⃣ Simple prefault with a static default value and a transform
        const schema1 = zod.string()
            .transform(val => val.length)
            .prefault("tuna");               // "tuna".length === 4
        assert.strictEqual(schema1.parse(undefined), 4);

        // 2️⃣ Prefault where the default value is provided as a function
        const schema2 = zod.number()
            .prefault(() => 42);
        assert.strictEqual(schema2.parse(undefined), 42);

        // 3️⃣ Ensure the default function is executed on each parse (lazy evaluation)
        let callCount = 0;
        const schema3 = zod.string()
            .prefault(() => {
                callCount += 1;
                return `value${callCount}`;
            });
        assert.strictEqual(schema3.parse(undefined), "value1");
        assert.strictEqual(schema3.parse(undefined), "value2");

        done();
    });
});