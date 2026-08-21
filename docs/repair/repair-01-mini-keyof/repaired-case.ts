test("object schema shape and keyof utility", () => {
  const obj = schemas.object({ a: schemas.string(), b: schemas.number() });
  expect(obj._zod.def.type).toBe("object");
  // shape is lazily defined; accessing triggers getter
  expect(obj.shape).toHaveProperty("a");
  expect(obj.shape).toHaveProperty("b");

  const keys = schemas.keyof(obj);
  // `keyof` now returns an enum schema instead of a literal schema
  expect(keys._zod.def.type).toBe("enum");
  // keys should contain both property names
  expect(keys._zod.def.values).toContain("a");
  expect(keys._zod.def.values).toContain("b");
});
