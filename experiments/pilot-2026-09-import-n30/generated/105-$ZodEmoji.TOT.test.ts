/**
 * Vitest test suite for the `$ZodEmoji` Zod schema.
 *
 * The `$ZodEmoji` schema is a specialised string format that validates
 * Unicode emoji characters using the default `regexes.emoji()` pattern.
 *
 * The tests cover:
 *   • Typical valid emoji strings (single, multiple, modifiers, ZWJ sequences)
 *   • Typical invalid strings (plain text, mixed content, empty)
 *   • Edge‑case Unicode handling (skin‑tone modifiers, family emojis)
 *   • Error messages and thrown exceptions
 *
 * The schema is exported from `./schemas.js` (relative to this test file).
 */

import { describe, it, expect } from 'vitest';
import { $ZodEmoji } from './schemas.js';

// Helper to create a fresh schema instance – `$ZodEmoji` is a constructor
// returned by `core.$constructor`, so calling it yields a Zod schema object.
const emojiSchema = () => $ZodEmoji();

/**
 * Utility to test parsing – returns the parsed value on success or throws
 * the ZodError on failure.
 */
function parse(schema: any, value: unknown) {
  // Zod schemas expose a `parse` method that either returns the value
  // (typed) or throws a `ZodError`.
  return schema.parse(value);
}

describe('$ZodEmoji – valid emoji strings', () => {
  it('accepts a single simple emoji', () => {
    const result = parse(emojiSchema(), '😀');
    expect(result).toBe('😀');
  });

  it('accepts a string of multiple emojis', () => {
    const result = parse(emojiSchema(), '😀🚀🌟');
    expect(result).toBe('😀🚀🌟');
  });

  it('accepts emojis with skin‑tone modifiers', () => {
    const result = parse(emojiSchema(), '👍🏽');
    expect(result).toBe('👍🏽');
  });

  it('accepts zero‑width‑joiner (ZWJ) sequences (family emoji)', () => {
    const result = parse(emojiSchema(), '👨‍👩‍👧‍👦');
    expect(result).toBe('👨‍👩‍👧‍👦');
  });

  it('accepts flag emojis (regional indicator symbols)', () => {
    const result = parse(emojiSchema(), '🇺🇸');
    expect(result).toBe('🇺🇸');
  });
});

describe('$ZodEmoji – invalid strings', () => {
  it('rejects plain ASCII text', () => {
    expect(() => parse(emojiSchema(), 'hello')).toThrowErrorMatchingSnapshot();
  });

  it('rejects mixed text and emoji', () => {
    expect(() => parse(emojiSchema(), 'hello😀')).toThrowErrorMatchingSnapshot();
  });

  it('rejects an empty string', () => {
    expect(() => parse(emojiSchema(), '')).toThrowErrorMatchingSnapshot();
  });

  it('rejects whitespace only', () => {
    expect(() => parse(emojiSchema(), '   ')).toThrowErrorMatchingSnapshot();
  });

  it('rejects numeric strings', () => {
    expect(() => parse(emojiSchema(), '12345')).toThrowErrorMatchingSnapshot();
  });
});

describe('$ZodEmoji – edge‑case handling', () => {
  it('accepts emoji with variation selector‑16 (VS16)', () => {
    // Some emojis are presented with an explicit VS16 to force emoji presentation.
    const result = parse(emojiSchema(), '✈️'); // U+2708 U+FE0F
    expect(result).toBe('✈️');
  });

  it('rejects a lone zero‑width joiner', () => {
    // ZWJ by itself is not a valid emoji.
    expect(() => parse(emojiSchema(), '\u200D')).toThrowErrorMatchingSnapshot();
  });

  it('rejects a surrogate pair that is not an emoji', () => {
    // Example: a musical symbol that is not part of the emoji set.
    expect(() => parse(emojiSchema(), '\uD834\uDD1E')).toThrowErrorMatchingSnapshot();
  });
});

/**
 * NOTE: The `$ZodEmoji` constructor automatically assigns the default
 * `regexes.emoji()` pattern when `def.pattern` is undefined.  Overriding the
 * pattern is possible by providing a custom definition, but that usage is
 * outside the scope of the public API and therefore not exercised here.
 */
