let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.readonly', function (done) {
        // ----- object readonly -----
        const ObjSchema = zod.object({ name: zod.string() }).readonly();
        const parsedObj = ObjSchema.parse({ name: "fido" });

        // value should be correct
        assert.strictEqual(parsedObj.name, "fido");

        // result should be frozen (readonly at runtime)
        assert.ok(Object.isFrozen(parsedObj), "Object should be frozen");

        // attempting to mutate should throw in strict mode
        assert.throws(
            () => {
                // the function body is strict, so assigning to a frozen property throws
                "use strict";
                parsedObj.name = "simba";
            },
            TypeError,
            "Mutation should throw TypeError"
        );

        // ----- array readonly -----
        const ArrSchema = zod.array(zod.string()).readonly();
        const parsedArr = ArrSchema.parse(["a", "b", "c"]);

        assert.deepStrictEqual(parsedArr, ["a", "b", "c"]);
        assert.ok(Object.isFrozen(parsedArr), "Array should be frozen");

        // ----- tuple readonly -----
        const TupSchema = zod.tuple([zod.string(), zod.number()]).readonly();
        const parsedTup = TupSchema.parse(["hello", 42]);

        assert.deepStrictEqual(parsedTup, ["hello", 42"]);
        assert.ok(Object.isFrozen(parsedTup), "Tuple (array) should be frozen");

        // ----- map readonly -----
        const MapSchema = zod.map(zod.string(), zod.date()).readonly();
        const date = new Date();
        const parsedMap = MapSchema.parse(new Map([["key", date]]));

        assert.ok(parsedMap instanceof Map, "Result should be a Map");
        assert.strictEqual(parsedMap.get("key"), date);
        // Zod does not freeze Map objects, but we can check that the prototype is ReadonlyMap
        // (the runtime value is still a Map, but the type is ReadonlyMap in TS)
        // Here we just ensure no error is thrown during parsing.

        done();
    });
});