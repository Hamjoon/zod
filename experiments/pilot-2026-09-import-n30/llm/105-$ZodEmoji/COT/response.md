**Explanation**

The `$ZodEmoji` export is a *Zod schema constructor* (created with `core.$constructor`).  
When invoked (`$ZodEmoji()`), it returns a Zod schema that behaves like a **string** schema with the `"emoji"` format applied.  
Therefore the public API we can test consists of the **standard Zod schema methods** (e.g. `parse`, `safeParse`, `refine`, `optional`, …).  
The most relevant ones for functional verification are:

| Method | Signature (simplified) | Description |
|--------|------------------------|-------------|
| `parse(value: unknown): string` | Returns the parsed string or throws `ZodError`. |
| `safeParse(value: unknown): { success: true; data: string } \| { success: false; error: ZodError }` | Returns a result object instead of throwing. |
| `optional(): ZodOptional<ZodString>` | Makes the schema accept `undefined`. |
| `nullable(): ZodNullable<ZodString>` | Makes the schema accept `null`. |
| `refine(check: (val: string) => boolean, message?: string): this` | Adds a custom validation. |
| `transform<T>(fn: (val: string) => T): ZodTransformer<…>` | Transforms the parsed value. |

The test suite below focuses on the **core validation behaviour** (`parse` / `safeParse`) and also demonstrates usage of a couple of the other public methods (`optional`, `refine`, `transform`).  

Edge‑case / exception scenarios that are covered:

* **Empty string** – should be rejected because the emoji regex requires at least one emoji.
* **Non‑emoji characters** – any alphabetic or numeric characters must cause a validation error.
* **Mixed content** – an emoji followed or preceded by other characters is invalid.
* **Multiple emojis** – the default regex (`regexes.emoji()`) accepts a sequence of emojis, so this should pass.
* **Compound / ZWJ emojis** (e.g. “🧑‍🚀”) – these are valid Unicode emoji and should be accepted.
* **Wrong type** – passing a number, object, etc. must throw a `ZodError`.
* **Optional schema** – `undefined` should be accepted when `.optional()` is used.
* **Custom refinement** – a refinement that only allows the “thumbs‑up” emoji demonstrates that custom checks are executed.
* **Transformation** – converting the emoji string to its Unicode code‑point array proves the `transform` method works.

All tests are written with **Vitest** and are wrapped in a single file that starts with `###Test START##` and ends with `###Test END##` as required.

---  

```typescript
###Test START##
import { describe, it, expect } from 'vitest';
import { $ZodEmoji } from './schemas.js';
import { ZodError } from 'zod';

describe('$ZodEmoji schema (core validation)', () => {
  // The base schema instance
  const EmojiSchema = $ZodEmoji();

  // -----------------------------------------------------------------
  // 1️⃣ Basic positive cases
  // -----------------------------------------------------------------
  it('should parse a single simple emoji', () => {
    const result = EmojiSchema.parse('😀');
    expect(result).toBe('😀');
  });

  it('should parse a string containing multiple emojis', () => {
    const result = EmojiSchema.parse('😀🚀🌟');
    expect(result).toBe('😀🚀🌟');
  });

  it('should parse a compound ZWJ emoji (e.g., astronaut)', () => {
    const astronaut = '🧑‍🚀'; // astronaut emoji built with Zero‑Width Joiner
    const result = EmojiSchema.parse(astronaut);
    expect(result).toBe(astronaut);
  });

  // -----------------------------------------------------------------
  // 2️⃣ Basic negative cases (expect ZodError)
  // -----------------------------------------------------------------
  it('should reject an empty string', () => {
    expect(() => EmojiSchema.parse('')).toThrowError(ZodError);
  });

  it('should reject a string with no emoji characters', () => {
    expect(() => EmojiSchema.parse('hello world')).toThrowError(ZodError);
  });

  it('should reject a string that mixes emoji with other characters', () => {
    expect(() => EmojiSchema.parse('😀abc')).toThrowError(ZodError);
    expect(() => EmojiSchema.parse('abc😀')).toThrowError(ZodError);
    expect(() => EmojiSchema.parse('😀123')).toThrowError(ZodError);
  });

  it('should reject a non‑string value (number)', () => {
    // @ts-expect-error – intentional wrong type
    expect(() => EmojiSchema.parse(123)).toThrowError(ZodError);
  });

  it('should reject a non‑string value (object)', () => {
    // @ts-expect-error – intentional wrong type
    expect(() => EmojiSchema.parse({ emoji: '😀' })).toThrowError(ZodError);
  });

  // -----------------------------------------------------------------
  // 3️⃣ safeParse – success / failure objects
  // -----------------------------------------------------------------
  it('safeParse returns success for a valid emoji', () => {
    const res = EmojiSchema.safeParse('🚀');
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data).toBe('🚀');
    }
  });

  it('safeParse returns failure for an invalid string', () => {
    const res = EmojiSchema.safeParse('not an emoji');
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toBeInstanceOf(ZodError);
    }
  });

  // -----------------------------------------------------------------
  // 4️⃣ Optional schema – undefined should be accepted
  // -----------------------------------------------------------------
  it('optional() allows undefined', () => {
    const optionalSchema = EmojiSchema.optional();
    const res = optionalSchema.safeParse(undefined);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data).toBeUndefined();
    }
  });

  // -----------------------------------------------------------------
  // 5️⃣ Custom refinement – only allow the thumbs‑up emoji
  // -----------------------------------------------------------------
  it('refine() correctly enforces a custom rule', () => {
    const thumbsUp = '👍';
    const refined = EmojiSchema.refine(
      (val) => val === thumbsUp,
      { message: 'Only 👍 is allowed' }
    );

    // Positive case
    expect(refined.parse(thumbsUp)).toBe(thumbsUp);

    // Negative case
    expect(() => refined.parse('😀')).toThrowError(ZodError);
  });

  // -----------------------------------------------------------------
  // 6️⃣ Transform – convert emoji string to an array of code points
  // -----------------------------------------------------------------
  it('transform() correctly maps the parsed value', () => {
    const toCodePoints = (val: string) => Array.from(val);
    const transformed = EmojiSchema.transform(toCodePoints);

    const input = '😀🚀';
    const result = transformed.parse(input);
    expect(result).toEqual(['😀', '🚀']);
  });
});
###Test END##
```