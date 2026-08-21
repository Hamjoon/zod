```ts
import { test, expect } from "vitest";
import * as toJSONSchema from "../../packages/zod/src/v4/core/to-json-schema.js";
import { z } from "../../packages/zod/src/v4/core/index.js";

test("string schema with min, max and format", () => {
  const schema = z.string().min(2).max(5).uuid(); // uuid -> format "uuid"
  const json = toJSONSchema.toJSONSchema(schema);
  expect(json).toMatchObject({
    type: "string",
    minLength: 2,
    maxLength: 5,
    format: "uuid",
  });
});

test("number schema with constraints and integer type", () => {
  const schema = z.number().min(0).max(10).int().multipleOf(2);
  const json = toJSONSchema.toJSONSchema(schema);
  expect(json).toMatchObject({
    type: "integer",
    minimum: 0,
    maximum: 10,
    multipleOf: 2,
  });
});

test("object schema required vs optional properties", () => {
  const schema = z.object({
    a: z.string(),
    b: z.number().optional(),
  });
  const json = toJSONSchema.toJSONSchema(schema);
  // required should contain only "a"
  expect(json).toMatchObject({
    type: "object",
    required: ["a"],
    additionalProperties: false,
  });
  // properties should exist
  expect(json.properties).toHaveProperty("a");
  expect(json.properties).toHaveProperty("b");
});

test("union schema produces anyOf", () => {
  const schema = z.union([z.string(), z.number()]);
  const json = toJSONSchema.toJSONSchema(schema);
  expect(Array.isArray(json.anyOf)).toBe(true);
  expect(json.anyOf).toHaveLength(2);
  const types = json.anyOf.map((s: any) => s.type).sort();
  expect(types).toEqual(["number", "string"]);
});

test("nullable schema creates anyOf with null", () => {
  const schema = z.string().nullable();
  const json = toJSONSchema.toJSONSchema(schema);
  expect(json.anyOf).toBeInstanceOf(Array);
  expect(json.anyOf).toHaveLength(2);
  const hasNull = json.anyOf.some((s: any) => s.type === "null");
  const hasString = json.anyOf.some((s: any) => s.type === "string");
  expect(hasNull).toBe(true);
  expect(hasString).toBe(true);
});

test("default schema adds default value", () => {
  const schema = z.string().default("hello");
  const json = toJSONSchema.toJSONSchema(schema);
  expect(json.default).toBe("hello");
});

test("bigint schema throws when unrepresentable", () => {
  const schema = z.bigint();
  expect(() => toJSONSchema.toJSONSchema(schema)).toThrow(
    "BigInt cannot be represented in JSON Schema"
  );
});

test("recursive (lazy) schema is emitted with $defs and $ref", () => {
  // Define a recursive linked list node type
  const Node: any = z.object({
    value: z.string(),
    next: z.lazy(() => Node).optional(),
  });
  const json = toJSONSchema.toJSONSchema(Node);
  // Root should be a $ref to "#"
  expect(json.$ref).toBe("#");
  // $defs should contain at least one definition (the node definition)
  const defs = (json as any).$defs ?? (json as any).definitions;
  expect(defs).toBeDefined();
  const defKeys = Object.keys(defs);
  expect(defKeys.length).toBeGreaterThan(0);
  // The definition should have a "value" property of type string
  const nodeDef = defs[defKeys[0]];
  expect(nodeDef.type).toBe("object");
  expect(nodeDef.properties).toHaveProperty("value");
  expect(nodeDef.properties.value.type).toBe("string");
});
```