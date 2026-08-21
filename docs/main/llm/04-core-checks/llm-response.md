```ts
import { test, expect, describe } from "vitest";
import * as checks from "../../packages/zod/src/v4/core/checks.js";

/**
 * Helper to create a minimal payload object.
 */
function makePayload<T>(value: T) {
  return { value, issues: [] as any[] };
}

/**
 * Executes all onattach callbacks for a check instance.
 */
function runOnAttach(inst: any) {
  // ensure a bag exists
  inst._zod.bag ??= {};
  for (const fn of inst._zod.onattach) fn(inst);
}

/* -------------------------------------------------------------------------- */
/*                     Numeric comparison checks (less/greater)               */
/* -------------------------------------------------------------------------- */
describe("Numeric comparison checks", () => {
  test("$ZodCheckLessThan – exclusive", () => {
    const def = { check: "less_than", value: 10, inclusive: false };
    const inst = new checks.$ZodCheckLessThan(def);
    runOnAttach(inst);
    expect(inst._zod.bag.exclusiveMaximum).toBe(10);

    const pass = makePayload(9);
    inst._zod.check(pass);
    expect(pass.issues).toHaveLength(0);

    const fail = makePayload(10);
    inst._zod.check(fail);
    expect(fail.issues).toHaveLength(1);
    expect(fail.issues[0].code).toBe("too_big");
  });

  test("$ZodCheckGreaterThan – inclusive", () => {
    const def = { check: "greater_than", value: 5, inclusive: true };
    const inst = new checks.$ZodCheckGreaterThan(def);
    runOnAttach(inst);
    expect(inst._zod.bag.minimum).toBe(5);

    const pass = makePayload(5);
    inst._zod.check(pass);
    expect(pass.issues).toHaveLength(0);

    const fail = makePayload(4);
    inst._zod.check(fail);
    expect(fail.issues).toHaveLength(1);
    expect(fail.issues[0].code).toBe("too_small");
  });
});

/* -------------------------------------------------------------------------- */
/*                               MultipleOf check                              */
/* -------------------------------------------------------------------------- */
describe("$ZodCheckMultipleOf", () => {
  test("number multiple_of", () => {
    const def = { check: "multiple_of", value: 3 };
    const inst = new checks.$ZodCheckMultipleOf(def);
    const ok = makePayload(9);
    inst._zod.check(ok);
    expect(ok.issues).toHaveLength(0);

    const bad = makePayload(10);
    inst._zod.check(bad);
    expect(bad.issues).toHaveLength(1);
    expect(bad.issues[0].code).toBe("not_multiple_of");
  });

  test("bigint multiple_of", () => {
    const def = { check: "multiple_of", value: 2n };
    const inst = new checks.$ZodCheckMultipleOf(def);
    const ok = makePayload(4n);
    inst._zod.check(ok);
    expect(ok.issues).toHaveLength(0);

    const bad = makePayload(5n);
    inst._zod.check(bad);
    expect(bad.issues).toHaveLength(1);
    expect(bad.issues[0].code).toBe("not_multiple_of");
  });
});

/* -------------------------------------------------------------------------- */
/*                               Number format check                           */
/* -------------------------------------------------------------------------- */
describe("$ZodCheckNumberFormat", () => {
  test("int format – non‑integer", () => {
    const def = { check: "number_format", format: "int32" };
    const inst = new checks.$ZodCheckNumberFormat(def);
    runOnAttach(inst);
    const payload = makePayload(3.14);
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(1);
    expect(payload.issues[0].code).toBe("invalid_type");
    expect(payload.issues[0].expected).toBe("int");
  });

  test("int format – out of safe range", () => {
    const def = { check: "number_format", format: "int32" };
    const inst = new checks.$ZodCheckNumberFormat(def);
    runOnAttach(inst);
    const payload = makePayload(Number.MAX_SAFE_INTEGER + 1);
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(1);
    expect(payload.issues[0].code).toBe("too_big");
  });

  test("float format – within range", () => {
    const def = { check: "number_format", format: "float64" };
    const inst = new checks.$ZodCheckNumberFormat(def);
    runOnAttach(inst);
    const payload = makePayload(1.23);
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(0);
  });
});

/* -------------------------------------------------------------------------- */
/*                               BigInt format check                           */
/* -------------------------------------------------------------------------- */
describe("$ZodCheckBigIntFormat", () => {
  test("int64 format – below minimum", () => {
    const def = { check: "bigint_format", format: "int64" };
    const inst = new checks.$ZodCheckBigIntFormat(def);
    runOnAttach(inst);
    const payload = makePayload(-9223372036854775809n); // less than int64 min
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(1);
    expect(payload.issues[0].code).toBe("too_small");
  });
});

/* -------------------------------------------------------------------------- */
/*                               Size checks                                   */
/* -------------------------------------------------------------------------- */
describe("Size checks", () => {
  test("$ZodCheckMaxSize", () => {
    const def = { check: "max_size", maximum: 3 };
    const inst = new checks.$ZodCheckMaxSize(def);
    runOnAttach(inst);
    expect(inst._zod.bag.maximum).toBe(3);

    const ok = makePayload({ size: 2 });
    inst._zod.check(ok);
    expect(ok.issues).toHaveLength(0);

    const bad = makePayload({ size: 5 });
    inst._zod.check(bad);
    expect(bad.issues).toHaveLength(1);
    expect(bad.issues[0].code).toBe("too_big");
  });

  test("$ZodCheckMinLength", () => {
    const def = { check: "min_length", minimum: 4 };
    const inst = new checks.$ZodCheckMinLength(def);
    runOnAttach(inst);
    expect(inst._zod.bag.minimum).toBe(4);

    const ok = makePayload("abcd");
    inst._zod.check(ok);
    expect(ok.issues).toHaveLength(0);

    const bad = makePayload("ab");
    inst._zod.check(bad);
    expect(bad.issues).toHaveLength(1);
    expect(bad.issues[0].code).toBe("too_small");
  });
});

/* -------------------------------------------------------------------------- */
/*                               Length checks                                 */
/* -------------------------------------------------------------------------- */
describe("Length checks", () => {
  test("$ZodCheckLengthEquals", () => {
    const def = { check: "length_equals", length: 3 };
    const inst = new checks.$ZodCheckLengthEquals(def);
    runOnAttach(inst);
    expect(inst._zod.bag.length).toBe(3);

    const ok = makePayload("abc");
    inst._zod.check(ok);
    expect(ok.issues).toHaveLength(0);

    const bad = makePayload("abcd");
    inst._zod.check(bad);
    expect(bad.issues).toHaveLength(1);
    expect(bad.issues[0].code).toBe("too_big");
  });
});

/* -------------------------------------------------------------------------- */
/*                               String format checks                           */
/* -------------------------------------------------------------------------- */
describe("String format checks", () => {
  test("$ZodCheckRegex – matching", () => {
    const def = { check: "string_format", format: "regex", pattern: /foo/ };
    const inst = new checks.$ZodCheckRegex(def);
    const payload = makePayload("foobar");
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(0);
  });

  test("$ZodCheckRegex – non‑matching", () => {
    const def = { check: "string_format", format: "regex", pattern: /bar/ };
    const inst = new checks.$ZodCheckRegex(def);
    const payload = makePayload("baz");
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(1);
    expect(payload.issues[0].code).toBe("invalid_format");
  });

  test("$ZodCheckLowerCase – fails on uppercase", () => {
    const def = { check: "string_format", format: "lowercase" };
    const inst = new checks.$ZodCheckLowerCase(def);
    const payload = makePayload("Abc");
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(1);
    expect(payload.issues[0].code).toBe("invalid_type");
  });

  test("$ZodCheckIncludes – present", () => {
    const def = { check: "string_format", format: "includes", includes: "test" };
    const inst = new checks.$ZodCheckIncludes(def);
    const payload = makePayload("this is a test string");
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(0);
  });

  test("$ZodCheckStartsWith – missing", () => {
    const def = { check: "string_format", format: "starts_with", prefix: "hello" };
    const inst = new checks.$ZodCheckStartsWith(def);
    const payload = makePayload("world hello");
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(1);
    expect(payload.issues[0].code).toBe("invalid_format");
  });

  test("$ZodCheckEndsWith – present", () => {
    const def = { check: "string_format", format: "ends_with", suffix: "end" };
    const inst = new checks.$ZodCheckEndsWith(def);
    const payload = makePayload("the end");
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(0);
  });
});

/* -------------------------------------------------------------------------- */
/*                               Property check                                 */
/* -------------------------------------------------------------------------- */
describe("$ZodCheckProperty", () => {
  test("passes when nested schema passes", () => {
    const nestedSchema = {
      _zod: {
        run: (payload: any) => ({ ...payload, issues: [] }),
      },
    } as any;
    const def = { check: "property", property: "age", schema: nestedSchema };
    const inst = new checks.$ZodCheckProperty(def);
    const payload = makePayload({ age: 30 });
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(0);
  });

  test("collects issues from nested schema", () => {
    const nestedSchema = {
      _zod: {
        run: (payload: any) => ({
          ...payload,
          issues: [{ code: "custom", message: "bad" }],
        }),
      },
    } as any;
    const def = { check: "property", property: "name", schema: nestedSchema };
    const inst = new checks.$ZodCheckProperty(def);
    const payload = makePayload({ name: "bob" });
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(1);
    expect(payload.issues[0].code).toBe("custom");
  });
});

/* -------------------------------------------------------------------------- */
/*                               Mime type check                                */
/* -------------------------------------------------------------------------- */
describe("$ZodCheckMimeType", () => {
  test("accepts allowed mime type", () => {
    const def = { check: "mime_type", mime: ["image/png", "image/jpeg"] };
    const inst = new checks.$ZodCheckMimeType(def);
    runOnAttach(inst);
    expect(inst._zod.bag.mime).toEqual(def.mime);

    const payload = makePayload({ type: "image/png" } as any);
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(0);
  });

  test("rejects disallowed mime type", () => {
    const def = { check: "mime_type", mime: ["application/json"] };
    const inst = new checks.$ZodCheckMimeType(def);
    const payload = makePayload({ type: "text/plain" } as any);
    inst._zod.check(payload);
    expect(payload.issues).toHaveLength(1);
    expect(payload.issues[0].code).toBe("invalid_value");
  });
});

/* -------------------------------------------------------------------------- */
/*                               Overwrite check                                */
/* -------------------------------------------------------------------------- */
describe("$ZodCheckOverwrite", () => {
  test("transforms the payload value", () => {
    const def = {
      check: "overwrite",
      tx: (v: number) => v * 2,
    };
    const inst = new checks.$ZodCheckOverwrite(def);
    const payload = makePayload(5);
    inst._zod.check(payload);
    expect(payload.value).toBe(10);
  });
});
```