let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nativeEnum', function(done) {
        // Helper to get the nativeEnum function regardless of the export shape
        const nativeEnum = (zod.z && typeof zod.z.nativeEnum === 'function')
            ? zod.z.nativeEnum
            : zod.nativeEnum;

        // ---------- usage #1: numeric enum ----------
        const FruitsNum = { Apple: 0, Banana: 1 } as const;
        const FruitEnumNum = nativeEnum(FruitsNum);

        // valid parses
        assert.strictEqual(FruitEnumNum.parse(FruitsNum.Apple), 0);
        assert.strictEqual(FruitEnumNum.parse(FruitsNum.Banana), 1);
        assert.strictEqual(FruitEnumNum.parse(0), 0);
        assert.strictEqual(FruitEnumNum.parse(1), 1);

        // invalid parse
        assert.throws(() => FruitEnumNum.parse(3), /ZodError/);

        // ---------- usage #2: mixed string/number enum ----------
        const FruitsMixed = { Apple: "apple", Banana: "banana", Cantaloupe: 2 } as const;
        const FruitEnumMixed = nativeEnum(FruitsMixed);

        // valid parses
        assert.strictEqual(FruitEnumMixed.parse(FruitsMixed.Apple), "apple");
        assert.strictEqual(FruitEnumMixed.parse(FruitsMixed.Banana), "banana");
        assert.strictEqual(FruitEnumMixed.parse(FruitsMixed.Cantaloupe), 2);
        assert.strictEqual(FruitEnumMixed.parse("apple"), "apple");
        assert.strictEqual(FruitEnumMixed.parse("banana"), "banana");
        assert.strictEqual(FruitEnumMixed.parse(2), 2);

        // invalid parse
        assert.throws(() => FruitEnumMixed.parse("Cantaloupe"), /ZodError/);

        // ---------- usage #3: plain object enum ----------
        const FruitsPlain = { Apple: "apple", Banana: "banana", Cantaloupe: 3 } as const;
        const FruitEnumPlain = nativeEnum(FruitsPlain);

        // valid parses
        assert.strictEqual(FruitEnumPlain.parse("apple"), "apple");
        assert.strictEqual(FruitEnumPlain.parse("banana"), "banana");
        assert.strictEqual(FruitEnumPlain.parse(3), 3);

        // invalid parse
        assert.throws(() => FruitEnumPlain.parse("Cantaloupe"), /ZodError/);

        done();
    });
});