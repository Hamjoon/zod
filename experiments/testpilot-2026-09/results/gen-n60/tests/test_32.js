let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.readonly', function(done) {
        // ----- object -----
        const objSchema = zod.object({ name: zod.string() }).readonly();
        const obj = objSchema.parse({ name: "fido" });
        assert.strictEqual(obj.name, "fido");
        assert.ok(Object.isFrozen(obj), "object should be frozen");
        assert.throws(() => { obj.name = "simba"; }, TypeError);

        // ----- array -----
        const arrSchema = zod.array(zod.string()).readonly();
        const arr = arrSchema.parse(["a", "b"]);
        assert.deepStrictEqual(arr, ["a", "b"]);
        assert.ok(Object.isFrozen(arr), "array should be frozen");
        assert.throws(() => { arr.push("c"); }, TypeError);

        // ----- tuple -----
        const tupleSchema = zod.tuple([zod.string(), zod.number()]).readonly();
        const tup = tupleSchema.parse(["x", 1]);
        assert.deepStrictEqual(tup, ["x", 1]);
        assert.ok(Object.isFrozen(tup), "tuple should be frozen");
        assert.throws(() => { tup[0] = "y"; }, TypeError);

        // ----- map -----
        const mapSchema = zod.map(zod.string(), zod.date()).readonly();
        const now = new Date();
        const map = mapSchema.parse(new Map([["key", now]]));
        assert.ok(map instanceof Map);
        assert.strictEqual(map.get("key"), now);
        assert.ok(Object.isFrozen(map), "map should be frozen");
        assert.throws(() => { map.set("new", new Date()); }, TypeError);

        // ----- set -----
        const setSchema = zod.set(zod.string()).readonly();
        const set = setSchema.parse(new Set(["a", "b"]));
        assert.ok(set instanceof Set);
        assert.ok(set.has("a"));
        assert.ok(Object.isFrozen(set), "set should be frozen");
        assert.throws(() => { set.add("c"); }, TypeError);

        done();
    });
});