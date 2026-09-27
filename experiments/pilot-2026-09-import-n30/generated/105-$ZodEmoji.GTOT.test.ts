/**
 * Vitest test suite for the `$ZodEmoji` schema.
 *
 * The `$ZodEmoji` schema is a Zod‑based string format that validates
 * Unicode emoji characters.  It is created via `core.$constructor`
 * and automatically receives a regular expression (`regexes.emoji()`)
 * that matches all valid emoji sequences.
 *
 * The tests below cover:
 *   • Basic positive cases (single emoji, multiple emojis, skin‑tone,
 *     ZWJ‑joined families, etc.)
 *   • Negative cases (plain text, empty string, mixed content, stray
 *     variation selectors, etc.)
 *   • The `parse` and `safeParse` APIs provided by Zod.
 *   • An internal sanity‑check that the default `pattern` is a RegExp.
 */

import { describe, it, expect } from 'vitest';
import { $ZodEmoji } from './schemas.js';

describe('$ZodEmoji schema', () => {
  /*** Positive / typical use cases ***/

  it('parses a single emoji', () => {
    const input = '😀';
    expect($ZodEmoji.parse(input)).toBe(input);
  });

  it('parses a string of multiple emojis', () => {
    const input = '😀🚀🌟';
    expect($ZodEmoji.parse(input)).toBe(input);
  });

  it('parses an emoji with a skin‑tone modifier', () => {
    const input = '👍🏽';
    expect($ZodEmoji.parse(input)).toBe(input);
  });

  it('parses a ZWJ‑joined family emoji', () => {
    const input = '👩‍👩‍👧‍👦';
    expect($ZodEmoji.parse(input)).toBe(input);
  });

  it('parses an emoji that includes a variation selector‑16 (U+FE0F)', () => {
    const input = '✈️'; // airplane + VS16
    expect($ZodEmoji.parse(input)).toBe(input);
  });

  /*** Negative / edge cases ***/

  it('rejects an empty string', () => {
    expect(() => $ZodEmoji.parse('')).toThrow();
  });

  it('rejects plain ASCII text', () => {
    expect(() => $ZodEmoji.parse('hello world')).toThrow();
  });

  it('rejects a string that mixes emoji and non‑emoji characters', () => {
    expect(() => $ZodEmoji.parse('😀hello')).toThrow();
  });

  it('rejects a string that contains only a variation selector', () => {
    // U+FE0F alone is not a valid emoji
    expect(() => $ZodEmoji.parse('\uFE0F')).toThrow();
  });

  it('rejects a numeric string', () => {
    expect(() => $ZodEmoji.parse('12345')).toThrow();
  });

  /*** safeParse API checks ***/

  it('safeParse succeeds for a valid emoji', () => {
    const result = $ZodEmoji.safeParse('🚴‍♂️'); // cyclist + gender ZWJ
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('🚴‍♂️');
    }
  });

  it('safeParse fails for an invalid string', () => {
    const result = $ZodEmoji.safeParse('not an emoji');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeDefined();
    }
  });

  /*** Internal implementation sanity check ***/

  it('has a RegExp pattern defined by default', () => {
    // Access the internal definition (Zod stores it under `_def`).
    // The cast to `any` is safe for test purposes.
    const internalDef = ( $ZodEmoji as any )._def;
    expect(internalDef).toBeDefined();
    expect(internalDef.pattern).toBeInstanceOf(RegExp);
  });
});
