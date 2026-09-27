"use strict";

let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function () {
    it('test zod.z.readonly', function (done) {
        // ----- object -----
        const objSchema = zod.object({ name: zod.string() }).readonly();
        const obj = objSchema.parse({ name: "fido" });
        assert.strictEqual(obj.name, "fido");
        assert.ok(Object.isFrozen(obj), "object should be frozen");
        // In strict mode assigning to a frozen object's property throws a TypeError
        assert.throws(() => { obj.name = "simba"; }, TypeError);

        // ----- array -----
        const arrSchema = zod.array(zod.string()).readonly();
        const arr = arrSchema.parse(["a", "b"]);
        assert.deepStrictEqual(arr, ["a", "b"]);
        assert.ok(Object.isFrozen(arr), "array should be frozen");
        // Mutating a frozen array throws a TypeError
        assert.throws(() => { arr.push("c"); }, TypeError);

        // ----- tuple -----
        const tupleSchema = zod.tuple([zod.string(), zod.number()]).readonly();
        const tup = tupleSchema.parse(["x", 1]);
        assert.deepStrictEqual(tup, ["x", 1]);
        assert.ok(Object.isFrozen(tup), "tuple should be frozen");
        // Mutating a frozen tuple throws a TypeError
        assert.throws(() => { tup[0] = "y"; }, TypeError);

        // ----- map -----
        const mapSchema = zod.map(zod.string(), zod.date()).readonly();
        const now = new Date();
        const map = mapSchema.parse(new Map([["key", now]]));
        assert.ok(map instanceof Map);
        assert.strictEqual(map.get("key"), now);
        assert.ok(Object.isFrozen(map), "map should be frozen");
        // Object.freeze does NOT prevent mutation of Map contents, so we just verify that
        // the map remains frozen (its shape) but allow mutation of its entries.
        // The test is adjusted accordingly.
        map.set("new", new Date());
        assert.ok(map.has("new"), "map should allow adding entries even when frozen");

        // ----- set -----
        const setSchema = zod.set(zod.string()).readonly();
        const set = setSchema.parse(new Set(["a", "b"]));
        assert.ok(set instanceof Set);
        assert.ok(set.has("a"));
        assert.ok(Object.isFrozen(set), "set should be frozen");
        // Similar to Map, Set contents can still be mutated after Object.freeze.
        set.add("c");
        assert.ok(set.has("c"), "set should allow adding entries even when frozen");

        done();
    });
});