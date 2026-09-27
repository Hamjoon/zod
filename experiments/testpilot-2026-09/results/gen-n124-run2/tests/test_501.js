let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
  it('test zod.z.check', function(done) {
    // ---------- usage #1 ----------
    const schema1 = zod.object({
      password: zod.string().min(8),
      confirmPassword: zod.string(),
      anotherField: zod.string(),
    }).check(
      zod.refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
        when(payload) {
          // run only when there are no issues on password/confirmPassword already
          return payload.issues.every((iss) => {
            const firstPathEl = iss.path?.[0];
            return firstPathEl !== "password" && firstPathEl !== "confirmPassword";
          });
        },
      })
    );

    // valid data – should not throw
    assert.doesNotThrow(() => schema1.parse({
      password: "abcdefgh",
      confirmPassword: "abcdefgh",
      anotherField: "hello",
    }));

    // mismatched passwords – should throw with our custom message
    try {
      schema1.parse({
        password: "abcdefgh",
        confirmPassword: "abcd1234",
        anotherField: "hello",
      });
      assert.fail("Expected a validation error for mismatched passwords");
    } catch (e) {
      const issues = e.issues || e.errors;
      assert(issues.some(err => err.message === "Passwords do not match"));
    }

    // ---------- usage #2 ----------
    const UniqueStringArray = zod.array(zod.string()).check((ctx) => {
      if (ctx.value.length > 3) {
        ctx.issues.push({
          code: "too_big",
          maximum: 3,
          origin: "array",
          inclusive: true,
          message: "Too many items 😡",
          input: ctx.value,
        });
      }
      if (ctx.value.length !== new Set(ctx.value).size) {
        ctx.issues.push({
          code: "custom",
          message: "No duplicates allowed.",
          input: ctx.value,
        });
      }
    });

    // valid array – should not throw
    assert.doesNotThrow(() => UniqueStringArray.parse(["a", "b", "c"]));

    // too many items
    try {
      UniqueStringArray.parse(["a", "b", "c", "d"]);
      assert.fail("Expected a validation error for too many items");
    } catch (e) {
      const issues = e.issues || e.errors;
      assert(issues.some(err => err.code === "too_big"));
    }

    // duplicate items
    try {
      UniqueStringArray.parse(["a", "b", "a"]);
      assert.fail("Expected a validation error for duplicate items");
    } catch (e) {
      const issues = e.issues || e.errors;
      assert(issues.some(err => err.message === "No duplicates allowed."));
    }

    // ---------- usage #3 ----------
    const myString = zod.string().check(
      zod.refine((val) => val.length > 8, { error: "Too short!" })
    );

    // long enough – should not throw
    assert.doesNotThrow(() => myString.parse("longenough"));

    // too short – should throw with custom error
    try {
      myString.parse("short");
      assert.fail("Expected a validation error for short string");
    } catch (e) {
      const issues = e.issues || e.errors;
      assert(issues.some(err => err.message === "Too short!"));
    }

    done();
  });
});