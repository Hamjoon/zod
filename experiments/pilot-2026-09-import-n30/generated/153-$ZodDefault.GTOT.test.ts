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
