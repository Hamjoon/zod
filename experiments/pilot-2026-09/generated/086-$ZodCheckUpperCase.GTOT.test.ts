import { describe, it, expect } from 'vitest'

/* ------------------------------------------------------------------
   Imports – adjust the relative paths according to your project layout.
   ------------------------------------------------------------------ */
import { $ZodCheckUpperCase } from './$ZodCheckUpperCase'   // the class under test
import { regexes } from './regexes'                       // contains `regexes.uppercase`
import type { $ZodCheckUpperCaseDef } from './$ZodCheckUpperCase'

/* ------------------------------------------------------------------
   Helper – a tiny wrapper to safely call `.parse` when the schema
   implements the Zod‑like API (`parse` throws on failure, `safeParse`
   returns an object). If the implementation differs you can adapt the
   helper accordingly.
   ------------------------------------------------------------------ */
function safeParse<T>(schema: any, value: T) {
  if (typeof schema.safeParse === 'function') {
    return schema.safeParse(value)
  }
  try {
    schema.parse(value)
    return { success: true, data: value, error: undefined }
  } catch (e: any) {
    return { success: false, data: undefined, error: e }
  }
}

/* ------------------------------------------------------------------
   Test suite for $ZodCheckUpperCase
   ------------------------------------------------------------------ */
describe('$ZodCheckUpperCase', () => {
  /* --------------------------------------------------------------
     1️⃣  Default pattern – the constructor must inject the built‑in
         uppercase regex when the user does not supply a `pattern`.
     -------------------------------------------------------------- */
  it('uses the default uppercase regex when no custom pattern is supplied', () => {
    // instantiate without a definition object
    const schema = $ZodCheckUpperCase()
    // internal definition is stored under `_zod.def`
    expect(schema._zod.def.pattern).toBe(regexes.uppercase)
  })

  /* --------------------------------------------------------------
     2️⃣  Positive case – a plain ASCII uppercase string should pass.
     -------------------------------------------------------------- */
  it('accepts a valid uppercase string', () => {
    const schema = $ZodCheckUpperCase()
    const result = safeParse(schema, 'HELLO WORLD')
    expect(result.success).toBe(true)
    expect(result.data).toBe('HELLO WORLD')
  })

  /* --------------------------------------------------------------
     3️⃣  Negative cases – strings that are not *strictly* uppercase.
     -------------------------------------------------------------- */
  it('rejects strings that contain any lowercase characters', () => {
    const schema = $ZodCheckUpperCase()
    const lower = safeParse(schema, 'Hello')
    const mixed = safeParse(schema, 'HeLLo')
    const lowerOnly = safeParse(schema, 'hello')
    expect(lower.success).toBe(false)
    expect(mixed.success).toBe(false)
    expect(lowerOnly.success).toBe(false)
  })

  /* --------------------------------------------------------------
     4️⃣  Edge case – empty string should be considered invalid.
     -------------------------------------------------------------- */
  it('rejects an empty string', () => {
    const schema = $ZodCheckUpperCase()
    const result = safeParse(schema, '')
    expect(result.success).toBe(false)
  })

  /* --------------------------------------------------------------
     5️⃣  Type safety – non‑string inputs must raise an error.
     -------------------------------------------------------------- */
  it('rejects non‑string values (number, boolean, null, undefined, object)', () => {
    const schema = $ZodCheckUpperCase()
    const cases = [123, true, null, undefined, {}, []] as any[]
    for (const val of cases) {
      const result = safeParse(schema, val)
      expect(result.success).toBe(false)
    }
  })

  /* --------------------------------------------------------------
     6️⃣  Custom pattern – user can override the default regex.
     -------------------------------------------------------------- */
  it('respects a user‑provided custom pattern', () => {
    const customPattern = /^[A-Z0-9]+$/ // only uppercase letters and digits
    const def: $ZodCheckUpperCaseDef = { pattern: customPattern } as any
    const schema = $ZodCheckUpperCase(def)

    // internal pattern should be exactly the one we passed
    expect(schema._zod.def.pattern).toBe(customPattern)

    // strings that match the custom pattern must pass
    expect(safeParse(schema, 'ABC123').success).toBe(true)

    // strings that do NOT match must fail
    expect(safeParse(schema, 'ABCdef').success).toBe(false)
    expect(safeParse(schema, 'abc123').success).toBe(false)
  })

  /* --------------------------------------------------------------
     7️⃣  Unicode – the default regex should accept Unicode uppercase
         characters (e.g., German ß is lowercase, but Ä, Ö, Ü are
         uppercase). This test ensures the implementation does not
         unintentionally restrict to ASCII only.
     -------------------------------------------------------------- */
  it('accepts Unicode uppercase characters', () => {
    const schema = $ZodCheckUpperCase()
    const unicodeUpper = safeParse(schema, 'ÄÖÜß') // ß is lowercase, should cause failure
    expect(unicodeUpper.success).toBe(false)

    const onlyUpper = safeParse(schema, 'ÄÖÜ')
    expect(onlyUpper.success).toBe(true)
  })

  /* --------------------------------------------------------------
     8️⃣  Whitespace handling – spaces are allowed by the default
         pattern (as `regexes.uppercase` typically includes `\s`), but
         you may want to assert the expected behaviour.
     -------------------------------------------------------------- */
  it('allows spaces within an uppercase string', () => {
    const schema = $ZodCheckUpperCase()
    const result = safeParse(schema, 'HELLO WORLD')
    expect(result.success).toBe(true)
  })
})
