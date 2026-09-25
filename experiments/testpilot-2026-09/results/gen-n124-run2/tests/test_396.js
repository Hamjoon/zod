let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.nativeEnum', function(done) {
        // ----- numeric enum -----
        enum FruitsNum {
            Apple,
            Banana,
        }
        const FruitNumSchema = zod.nativeEnum(FruitsNum);
        // valid parses
        assert.strictEqual(FruitNumSchema.parse(FruitsNum.Apple), 0);
        assert.strictEqual(FruitNumSchema.parse(FruitsNum.Banana), 1);
        assert.strictEqual(FruitNumSchema.parse(0), 0);
        assert.strictEqual(FruitNumSchema.parse(1), 1);
        // invalid parse should throw
        assert.throws(() => FruitNumSchema.parse(2), zod.ZodError);

        // ----- mixed enum (string + numeric) -----
        enum FruitsMixed {
            Apple = "apple",
            Banana = "banana",
            Cantaloupe, // becomes 0 (numeric) because previous members are strings
        }
        const FruitMixedSchema = zod.nativeEnum(FruitsMixed);
        // valid parses
        assert.strictEqual(FruitMixedSchema.parse(FruitsMixed.Apple), "apple");
        assert.strictEqual(FruitMixedSchema.parse(FruitsMixed.Banana), "banana");
        assert.strictEqual(FruitMixedSchema.parse(FruitsMixed.Cantaloupe), 0);
        assert.strictEqual(FruitMixedSchema.parse("apple"), "apple");
        assert.strictEqual(FruitMixedSchema.parse("banana"), "banana");
        assert.strictEqual(FruitMixedSchema.parse(0), 0);
        // invalid parse
        assert.throws(() => FruitMixedSchema.parse("Cantaloupe"), zod.ZodError);
        assert.throws(() => FruitMixedSchema.parse(3), zod.ZodError);

        // ----- const object enum -----
        const FruitsObj = {
            Apple: "apple",
            Banana: "banana",
            Cantaloupe: 3,
        } as const;
        const FruitObjSchema = zod.nativeEnum(FruitsObj);
        // valid parses
        assert.strictEqual(FruitObjSchema.parse("apple"), "apple");
        assert.strictEqual(FruitObjSchema.parse("banana"), "banana");
        assert.strictEqual(FruitObjSchema.parse(3), 3);
        // invalid parses
        assert.throws(() => FruitObjSchema.parse("Cantaloupe"), zod.ZodError);
        assert.throws(() => FruitObjSchema.parse(0), zod.ZodError);

        done();
    });
});