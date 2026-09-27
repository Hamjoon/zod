**Three‑expert round‑table**

Below is the transcript of the three “experts” as they work through the task.  
Each expert contributes one test case per method, then they discuss edge‑cases, and finally they merge everything into a single Vitest file.

---

## 1️⃣  Extract public methods (signature)

| Method | Signature (as exposed on the instance) | Where it is defined |
|--------|----------------------------------------|----------------------|
| `parse` | `parse(payload: { value: any }, ctx: any): any \| Promise<any>` | defined on `inst._zod.parse` inside the `$ZodDefault` constructor |
| `run`  | *inherited* from `$ZodType` – not overridden here, but used internally by `parse` | `$ZodType` (outside the snippet) |
| `safeParse` / `validate` … | *inherited* – not required for the minimal test suite because they delegate to `parse` | `$ZodType` |

> **Only `parse` has custom behaviour in `$ZodDefault`; the rest are just the generic Zod‑type API.**  
> For the purpose of this assignment we will write tests that target `parse` directly (the public entry‑point) and also verify that the lazy `values` getter works.

---

## 2️⃣  Basic Vitest test case per method  

### Expert 1 – `parse` (synchronous path)

```ts
it('returns the default value when payload.value is undefined (sync inner type)', () => {
  const inner = {
    _zod: {
      run: (p: any) => ({ ...p, value: Number(p.value) }), // simple identity conversion
      values: {}
    }
  };
  const schema = new $ZodDefault({ innerType: inner, defaultValue: 42 } as any);
  const result = schema._zod.parse({ value: undefined }, {});
  expect(result.value).toBe(42);
});
```

### Expert 2 – `parse` (asynchronous inner type)

```ts
it('awaits an async inner type and still applies the default handling', async () => {
  const inner = {
    _zod: {
      run: (p: any) => Promise.resolve({ ...p, value: p.value * 2 }),
      values: {}
    }
  };
  const schema = new $ZodDefault({ innerType: inner, defaultValue: 10 } as any);
  const result = await schema._zod.parse({ value: 5 }, {});
  expect(result.value).toBe(10); // because payload.value !== undefined → inner run → 5*2 =10
});
```

### Expert 3 – lazy `values` getter

```ts
it('exposes the inner type values lazily via the `values` getter', () => {
  const innerValues = { foo: 'bar' };
  const inner = {
    _zod: {
      run: (p: any) => p,
      values: innerValues
    }
  };
  const schema = new $ZodDefault({ innerType: inner, defaultValue: 'x' } as any);
  // The getter is defined lazily – accessing it should return the same object
  expect(schema._zod.values).toBe(innerValues);
});
```

---

## 3️⃣  Identify edge‑cases & exception scenarios  

| Edge case / scenario | Why it matters |
|----------------------|----------------|
| **Default is a getter** – `defaultValue` defined via `Object.defineProperty` with a getter that returns a fresh value each call. | Guarantees that the implementation reads the value *at parse time* and not once at construction. |
| **Inner type throws** – `inner._zod.run` throws synchronously. | `parse` should let the exception bubble (no swallow). |
| **Inner type returns a rejected promise** – async error path. | `parse` must propagate the rejection. |
| **Payload value is `null`** – not `undefined`. Should *not* trigger default. | Confirms the `=== undefined` check is precise. |
| **`defaultValue` itself is `undefined`** – illegal according to the type, but we test that the code still returns `undefined` (defensive). | Defensive test for misuse. |
| **Multiple calls** – ensure that the lazy `values` getter is memoised (same reference each time). | Guarantees lazy init works correctly. |

---

## 4️⃣  Edge‑case Vitest test cases  

### Expert 1 – default getter

```ts
it('uses a getter for defaultValue each time parse is called', () => {
  let counter = 0;
  const inner = { _zod: { run: (p: any) => p, values: {} } };
  const def = {
    innerType: inner,
    get defaultValue() {
      counter += 1;
      return counter; // 1 on first call, 2 on second, …
    }
  } as any;
  const schema = new $ZodDefault(def);
  const r1 = schema._zod.parse({ value: undefined }, {});
  const r2 = schema._zod.parse({ value: undefined }, {});
  expect(r1.value).toBe(1);
  expect(r2.value).toBe(2);
});
```

### Expert 2 – inner type throws synchronously

```ts
it('propagates a synchronous error thrown by the inner type', () => {
  const inner = {
    _zod: {
      run: () => { throw new Error('inner failure'); },
      values: {}
    }
  };
  const schema = new $ZodDefault({ innerType: inner, defaultValue: 'ok' } as any);
  expect(() => schema._zod.parse({ value: 123 }, {})).toThrow('inner failure');
});
```

### Expert 3 – async rejection & null payload

```ts
it('propagates a rejected promise from the inner type', async () => {
  const inner = {
    _zod: {
      run: () => Promise.reject(new Error('async failure')),
      values: {}
    }
  };
  const schema = new $ZodDefault({ innerType: inner, defaultValue: 0 } as any);
  await expect(schema._zod.parse({ value: 5 }, {})).rejects.toThrow('async failure');
});

it('does NOT replace null with the default (only undefined)', () => {
  const inner = { _zod: { run: (p: any) => p, values: {} } };
  const schema = new $ZodDefault({ innerType: inner, defaultValue: 'def' } as any);
  const result = schema._zod.parse({ value: null }, {});
  expect(result.value).toBeNull(); // null is a legit value, not replaced
});
```

### Expert 1 – defaultValue = undefined (defensive)

```ts
it('returns undefined when defaultValue itself is undefined (even though it is illegal)', () => {
  const inner = { _zod: { run: (p: any) => p, values: {} } };
  const schema = new $ZodDefault({ innerType: inner, defaultValue: undefined as any } as any);
  const result = schema._zod.parse({ value: undefined }, {});
  expect(result.value).toBeUndefined();
});
```

### Expert 2 – lazy `values` memoisation

```ts
it('memoises the lazy `values` getter (same reference on repeated access)', () => {
  const innerValues = { a: 1 };
  const inner = { _zod: { run: (p: any) => p, values: innerValues } };
  const schema = new $ZodDefault({ innerType: inner, defaultValue: 0 } as any);
  const first = schema._zod.values;
  const second = schema._zod.values;
  expect(first).toBe(second);
});
```

---

## 5️⃣  Merged, complete Vitest test file  

Below is the final, ready‑to‑run test suite.  
All tests are self‑contained; the only external import is the `$ZodDefault` constructor from `./schemas.js`.  
The file is wrapped with the required markers.

```ts
###Test START##
import { describe, it, expect } from 'vitest';
import { $ZodDefault } from './schemas.js';

// ---------------------------------------------------------------------------
// Helper to create a minimal “inner” Zod‑like schema that satisfies the
// expectations of $ZodDefault (only _zod.run and _zod.values are needed).
// ---------------------------------------------------------------------------
function makeInner(runFn: (payload: any, ctx: any) => any | Promise<any>, values = {}) {
  return {
    _zod: {
      run: runFn,
      values,
    },
  } as any;
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------
describe('$ZodDefault – core behaviour', () => {
  // ---------- basic synchronous default ----------
  it('returns the default value when payload.value is undefined (sync inner type)', () => {
    const inner = makeInner((p) => ({ ...p, value: Number(p.value) }));
    const schema = new $ZodDefault({ innerType: inner, defaultValue: 42 } as any);
    const result = schema._zod.parse({ value: undefined }, {});
    expect(result.value).toBe(42);
  });

  // ---------- async inner type ----------
  it('awaits an async inner type and still applies the default handling', async () => {
    const inner = makeInner((p) => Promise.resolve({ ...p, value: p.value * 2 }));
    const schema = new $ZodDefault({ innerType: inner, defaultValue: 10 } as any);
    const result = await schema._zod.parse({ value: 5 }, {});
    expect(result.value).toBe(10);
  });

  // ---------- lazy values getter ----------
  it('exposes the inner type values lazily via the `values` getter', () => {
    const innerValues = { foo: 'bar' };
    const inner = makeInner((p) => p, innerValues);
    const schema = new $ZodDefault({ innerType: inner, defaultValue: 'x' } as any);
    expect(schema._zod.values).toBe(innerValues);
  });

  // ---------- default getter ----------
  it('uses a getter for defaultValue each time parse is called', () => {
    let counter = 0;
    const inner = makeInner((p) => p);
    const def = {
      innerType: inner,
      get defaultValue() {
        counter += 1;
        return counter;
      },
    } as any;
    const schema = new $ZodDefault(def);
    const r1 = schema._zod.parse({ value: undefined }, {});
    const r2 = schema._zod.parse({ value: undefined }, {});
    expect(r1.value).toBe(1);
    expect(r2.value).toBe(2);
  });

  // ---------- synchronous inner error ----------
  it('propagates a synchronous error thrown by the inner type', () => {
    const inner = makeInner(() => {
      throw new Error('inner failure');
    });
    const schema = new $ZodDefault({ innerType: inner, defaultValue: 'ok' } as any);
    expect(() => schema._zod.parse({ value: 123 }, {})).toThrow('inner failure');
  });

  // ---------- async rejection ----------
  it('propagates a rejected promise from the inner type', async () => {
    const inner = makeInner(() => Promise.reject(new Error('async failure')));
    const schema = new $ZodDefault({ innerType: inner, defaultValue: 0 } as any);
    await expect(schema._zod.parse({ value: 5 }, {})).rejects.toThrow('async failure');
  });

  // ---------- null is not treated as undefined ----------
  it('does NOT replace null with the default (only undefined)', () => {
    const inner = makeInner((p) => p);
    const schema = new $ZodDefault({ innerType: inner, defaultValue: 'def' } as any);
    const result = schema._zod.parse({ value: null }, {});
    expect(result.value).toBeNull();
  });

  // ---------- defaultValue = undefined (defensive) ----------
  it('returns undefined when defaultValue itself is undefined (even though it is illegal)', () => {
    const inner = makeInner((p) => p);
    const schema = new $ZodDefault({ innerType: inner, defaultValue: undefined as any } as any);
    const result = schema._zod.parse({ value: undefined }, {});
    expect(result.value).toBeUndefined();
  });

  // ---------- lazy values memoisation ----------
  it('memoises the lazy `values` getter (same reference on repeated access)', () => {
    const innerValues = { a: 1 };
    const inner = makeInner((p) => p, innerValues);
    const schema = new $ZodDefault({ innerType: inner, defaultValue: 0 } as any);
    const first = schema._zod.values;
    const second = schema._zod.values;
    expect(first).toBe(second);
  });
});
###Test END##
```

**Explanation of the final file**

* The file starts and ends with the required markers.  
* A tiny `makeInner` helper builds the minimal inner schema needed for the tests (only `run` and `values`).  
* Each `it` block corresponds to one of the test ideas generated by the three experts.  
* Both synchronous and asynchronous paths are exercised, as well as the lazy getter, getter‑based defaults, error propagation, and the precise `undefined` check.  
* The suite can be run with Vitest (`vitest run`) and should pass as long as the `$ZodDefault` implementation matches the source snippet provided.