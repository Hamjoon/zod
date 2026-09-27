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
