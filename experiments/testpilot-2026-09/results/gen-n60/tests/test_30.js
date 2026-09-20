let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.readonly', function(done) {
        // Test readonly object schema
        const ObjSchema = zod.object({ name: zod.string() }).readonly();
        const obj = ObjSchema.parse({ name: "fido" });
        // Value should be parsed correctly
        assert.strictEqual(obj.name, "fido");
        // The result should be frozen (readonly at runtime)
        assert.ok(Object.isFrozen(obj), "Parsed object should be frozen");
        // Attempting to mutate should throw
        let threw = false;
        try {
            obj.name = "simba";
        } catch (e) {
            threw = true;
        }
        assert.ok(threw, "Mutating a readonly object should throw");

        // Test readonly array schema
        const ArrSchema = zod.array(zod.string()).readonly();
        const arr = ArrSchema.parse(["a", "b", "c"]);
        // Values should be parsed correctly
        assert.deepStrictEqual(arr, ["a", "b", "c"]);
        // The array should be frozen
        assert.ok(Object.isFrozen(arr), "Parsed array should be frozen");
        // Mutating the array (e.g., push) should throw
        threw = false;
        try {
            arr.push("d");
        } catch (e) {
            threw = true;
        }
        assert.ok(threw, "Mutating a readonly array should throw");

        done();
    });
});