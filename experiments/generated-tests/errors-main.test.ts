import { test, expect, describe } from "vitest";
import * as errors from "../../packages/zod/src/v4/core/errors.js";

/* Helper to create a minimal issue */
function makeIssue(partial: Partial<errors.$ZodIssueBase> & { code: string }) {
  return {
    code: partial.code,
    message: partial.message ?? "default message",
    path: partial.path ?? [],
    // other fields are optional for our tests; we cast to any to satisfy the type system
    ...(partial as any),
  } as any;
}

/* -------------------------------------------------------------------------- */
/* $ZodError basic behavior                                                   */
/* -------------------------------------------------------------------------- */
describe("$ZodError class", () => {
  const issueA = makeIssue({
    code: "invalid_type",
    expected: "string",
    input: 123,
    path: ["username"],
    message: "Username must be a string",
  });

  const issueB = makeIssue({
    code: "custom",
    message: "Root level custom error",
    path: [],
  });

  const err = new errors.$ZodError([issueA, issueB]);

  test("stores issues and name", () => {
    expect(err.issues).toEqual([issueA, issueB]);
    expect(err.name).toBe("$ZodError");
  });

  test("message getter returns JSON string of issues", () => {
    const parsed = JSON.parse(err.message);
    expect(parsed).toEqual([issueA, issueB]);
  });

  test("toString mirrors message", () => {
    expect(err.toString()).toBe(err.message);
  });
});

/* -------------------------------------------------------------------------- */
/* flattenError                                                               */
/* -------------------------------------------------------------------------- */
describe("flattenError", () => {
  const issueField = makeIssue({
    code: "invalid_type",
    message: "Field error",
    path: ["user", "email"],
  });
  const issueForm = makeIssue({
    code: "custom",
    message: "Form error",
    path: [],
  });
  const err = new errors.$ZodError([issueField, issueForm]);

  test("default mapper groups by field vs form", () => {
    const flat = errors.flattenError(err);
    expect(flat.fieldErrors).toEqual({ user: ["Field error"] });
    expect(flat.formErrors).toEqual(["Form error"]);
  });

  test("custom mapper transforms messages", () => {
    const flat = errors.flattenError(err, (i) => i.code);
    expect(flat.fieldErrors).toEqual({ user: ["invalid_type"] });
    expect(flat.formErrors).toEqual(["custom"]);
  });
});

/* -------------------------------------------------------------------------- */
/* formatError                                                                */
/* -------------------------------------------------------------------------- */
describe("formatError", () => {
  const issueRoot = makeIssue({
    code: "custom",
    message: "Root issue",
    path: [],
  });
  const issueNested = makeIssue({
    code: "invalid_type",
    message: "Nested issue",
    path: ["profile", "age"],
  });
  const issueUnion = makeIssue({
    code: "invalid_union",
    message: "Union issue",
    path: ["choice"],
    errors: [
      [{ code: "custom", message: "Option A bad", path: [] } as any],
      [{ code: "custom", message: "Option B bad", path: [] } as any],
    ],
  });
  const err = new errors.$ZodError([issueRoot, issueNested, issueUnion]);

  test("produces formatted object with _errors", () => {
    const formatted = errors.formatError(err);
    // root issue goes to top-level _errors
    expect(formatted._errors).toContain("Root issue");
    // nested path creates nested objects
    expect(formatted.profile?.age?._errors).toContain("Nested issue");
    // union errors are flattened into the same path
    expect(formatted.choice?._errors).toContain("Union issue");
  });

  test("custom mapper works", () => {
    const formatted = errors.formatError(err, (i) => i.code);
    expect(formatted._errors).toContain("custom");
    expect(formatted.profile?.age?._errors).toContain("invalid_type");
  });
});

/* -------------------------------------------------------------------------- */
/* treeifyError                                                               */
/* -------------------------------------------------------------------------- */
describe("treeifyError", () => {
  const issueArray = makeIssue({
    code: "invalid_type",
    message: "Array element error",
    path: [0],
  });
  const issueProp = makeIssue({
    code: "custom",
    message: "Property error",
    path: ["settings", "theme"],
  });
  const err = new errors.$ZodError([issueArray, issueProp]);

  test("creates error tree with items and properties", () => {
    const tree = errors.treeifyError(err);
    // root errors empty
    expect(tree.errors).toEqual([]);
    // array index 0 under items
    expect(tree.items?.[0]?.errors).toContain("Array element error");
    // nested property under properties
    expect(tree.properties?.settings?.properties?.theme?.errors).toContain(
      "Property error"
    );
  });

  test("custom mapper returns codes", () => {
    const tree = errors.treeifyError(err, (i) => i.code);
    expect(tree.items?.[0]?.errors).toContain("invalid_type");
    expect(tree.properties?.settings?.properties?.theme?.errors).toContain(
      "custom"
    );
  });
});

/* -------------------------------------------------------------------------- */
/* toDotPath                                                                  */
/* -------------------------------------------------------------------------- */
describe("toDotPath", () => {
  test("handles simple strings", () => {
    expect(errors.toDotPath(["a", "b"])).toBe("a.b");
  });
  test("handles numbers as indices", () => {
    expect(errors.toDotPath(["arr", 2, "x"])).toBe("arr[2].x");
  });
  test("handles symbols and special chars", () => {
    const sym = Symbol("s");
    expect(errors.toDotPath([sym])).toBe(`[${JSON.stringify(String(sym))}]`);
    expect(errors.toDotPath(["weird key"])).toBe(`["weird key"]`);
  });
});

/* -------------------------------------------------------------------------- */
/* prettifyError                                                              */
/* -------------------------------------------------------------------------- */
describe("prettifyError", () => {
  const unsortedIssues = [
    makeIssue({
      code: "custom",
      message: "Second",
      path: ["b"],
    }),
    makeIssue({
      code: "custom",
      message: "First",
      path: [],
    }),
    makeIssue({
      code: "custom",
      message: "Third",
      path: ["a", "c"],
    }),
  ];

  test("sorts by path length and formats lines", () => {
    const output = errors.prettifyError({ issues: unsortedIssues });
    const lines = output.split("\n");
    // First line should be the root issue (shortest path)
    expect(lines[0]).toBe("✖ First");
    // Next should be the issue with path length 1
    expect(lines[1]).toBe(`  → at ${errors.toDotPath(["b"])}`);
    // Then the deeper path issue
    expect(lines[2]).toBe("✖ Third");
    expect(lines[3]).toBe(`  → at ${errors.toDotPath(["a", "c"])}`);
  });
});
