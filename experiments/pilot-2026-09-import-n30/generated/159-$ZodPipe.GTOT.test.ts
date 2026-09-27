/**
 * Vitest test suite for the `$ZodPipe` implementation.
 *
 * The tests cover:
 *   • Public method extraction (only `parse` is public)
 *   • Basic synchronous and asynchronous behaviour
 *   • Edge‑cases: synchronous throw, async rejection, handlePipeResult errors,
 *     missing context, undefined payload.
 *
 * The real `$ZodPipe` depends on many internal Zod utilities.
 * For unit‑testing we mock the minimal parts we need:
 *   – `def.in._zod.run` (sync or async)
 *   – `def.out._zod` (unused by the pipe itself)
 *   – `handlePipeResult` (the final transformation step)
 *
 * The `$ZodPipe` constructor exported from `./schemas.js` is assumed to be a
 * callable that receives a definition object and returns an instance with a
 * `_zod.parse` method (this matches Zod’s `$constructor` behaviour).
 */

import { describe, it, expect, vi } from 'vitest';
import { $ZodPipe } from './schemas.js';

// ---------------------------------------------------------------------------
// Helper: create a very small mock Zod type that only implements the parts
// we need for the pipe (run + lazy properties).  The shape mirrors the
// internal Zod type contract used by `$ZodPipe`.
// ---------------------------------------------------------------------------
function mockZodType(runImpl: (payload: unknown, ctx?: any) => unknown | Promise<unknown>) {
  return {
    _zod: {
      // `run` is the core method used by the pipe to process the payload.
      run: runImpl,
      // The following lazy‑loaded properties are accessed by `$ZodPipe` but
      // never used in our tests – they just need to exist.
      values: {},
      optin: {},
      optout: {},
      propValues: {}
    }
  };
}

// ---------------------------------------------------------------------------
// Mock `handlePipeResult` – the real implementation validates the output
// schema.  For our unit tests we replace it with a simple identity function
// (or a function that can be forced to throw).
// ---------------------------------------------------------------------------
vi.mock('./schemas.js', async (importOriginal) => {
  const original = await importOriginal<any>();
  return {
    ...original,
    // The pipe implementation imports `handlePipeResult` from the same module
    // (or a sibling).  We replace it with a mock that simply returns the
    // left value prefixed with a marker so we can assert that it was called.
    handlePipeResult: vi.fn((left: unknown) => `handled:${String(left)}`)
  };
});

// After the mock, re‑import the pipe so it uses the mocked `handlePipeResult`.
const { $ZodPipe: PipeConstructor, handlePipeResult } = await import('./schemas.js');

describe('$ZodPipe – public API', () => {
  it('exposes a parse method with the correct signature', () => {
    const inSchema = mockZodType(() => 42);
    const outSchema = mockZodType(() => 42);
    const pipe = PipeConstructor({
      type: 'pipe',
      in: inSchema,
      out: outSchema
    } as any);

    // The parse method lives on the internal `_zod` object.
    expect(typeof pipe._zod.parse).toBe('function');
    // TypeScript signature check is done at compile time; at runtime we just
    // ensure it accepts two arguments.
    expect(pipe._zod.parse.length).toBe(2);
  });
});

describe('$ZodPipe – basic functionality', () => {
  it('parse (sync) forwards the value through handlePipeResult', () => {
    const inSchema = mockZodType((payload) => payload);
    const outSchema = mockZodType(() => {}); // not used
    const pipe = PipeConstructor({
      type: 'pipe',
      in: inSchema,
      out: outSchema
    } as any);

    const result = pipe._zod.parse('hello');
    expect(handlePipeResult).toHaveBeenCalledOnce();
    expect(handlePipeResult).toHaveBeenCalledWith('hello', expect.any(Object), undefined);
    expect(result).toBe('handled:hello');
  });

  it('parse (async) resolves with the handled result', async () => {
    const inSchema = mockZodType((payload) => Promise.resolve(payload));
    const outSchema = mockZodType(() => {});
    const pipe = PipeConstructor({
      type: 'pipe',
      in: inSchema,
      out: outSchema
    } as any);

    const result = await pipe._zod.parse('async‑value');
    expect(handlePipeResult).toHaveBeenCalledOnce();
    expect(handlePipeResult).toHaveBeenCalledWith('async‑value', expect.any(Object), undefined);
    expect(result).toBe('handled:async‑value');
  });
});

describe('$ZodPipe – edge cases & error handling', () => {
  it('propagates a synchronous error thrown by the input schema', () => {
    const error = new Error('sync‑run‑error');
    const inSchema = mockZodType(() => {
      throw error;
    });
    const outSchema = mockZodType(() => {});
    const pipe = PipeConstructor({
      type: 'pipe',
      in: inSchema,
      out: outSchema
    } as any);

    expect(() => pipe._zod.parse('any')).toThrow(error);
    // `handlePipeResult` must not be called when the input throws.
    expect(handlePipeResult).not.toHaveBeenCalled();
  });

  it('propagates a rejected promise from the input schema', async () => {
    const rejectReason = new Error('async‑run‑reject');
    const inSchema = mockZodType(() => Promise.reject(rejectReason));
    const outSchema = mockZodType(() => {});
    const pipe = PipeConstructor({
      type: 'pipe',
      in: inSchema,
      out: outSchema
    } as any);

    await expect(pipe._zod.parse('any')).rejects.toThrow(rejectReason);
    expect(handlePipeResult).not.toHaveBeenCalled();
  });

  it('propagates an error thrown by handlePipeResult (sync path)', () => {
    const inSchema = mockZodType((payload) => payload);
    const outSchema = mockZodType(() => {});
    const pipe = PipeConstructor({
      type: 'pipe',
      in: inSchema,
      out: outSchema
    } as any);

    // Make the mocked handlePipeResult throw.
    (handlePipeResult as any).mockImplementationOnce(() => {
      throw new Error('handle‑error');
    });

    expect(() => pipe._zod.parse('boom')).toThrow('handle‑error');
  });

  it('propagates an error thrown by handlePipeResult (async path)', async () => {
    const inSchema = mockZodType((payload) => Promise.resolve(payload));
    const outSchema = mockZodType(() => {});
    const pipe = PipeConstructor({
      type: 'pipe',
      in: inSchema,
      out: outSchema
    } as any);

    (handlePipeResult as any).mockImplementationOnce(() => {
      throw new Error('async‑handle‑error');
    });

    await expect(pipe._zod.parse('boom')).rejects.toThrow('async‑handle‑error');
  });

  it('works when ctx is undefined', () => {
    const inSchema = mockZodType((payload) => payload);
    const outSchema = mockZodType(() => {});
    const pipe = PipeConstructor({
      type: 'pipe',
      in: inSchema,
      out: outSchema
    } as any);

    const result = pipe._zod.parse('no‑ctx', undefined);
    expect(handlePipeResult).toHaveBeenCalledWith('no‑ctx', expect.any(Object), undefined);
    expect(result).toBe('handled:no‑ctx');
  });

  it('handles undefined payload gracefully', () => {
    const inSchema = mockZodType((payload) => payload);
    const outSchema = mockZodType(() => {});
    const pipe = PipeConstructor({
      type: 'pipe',
      in: inSchema,
      out: outSchema
    } as any);

    const result = pipe._zod.parse(undefined);
    expect(handlePipeResult).toHaveBeenCalledWith(undefined, expect.any(Object), undefined);
    expect(result).toBe('handled:undefined');
  });
});
