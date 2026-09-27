import { describe, expect, test } from 'vitest';
import { $ZodIPv6 } from './schemas.js';

// ---------------------------------------------------------------------------
// Helper – extracts the first issue from a ZodError (if any)
// ---------------------------------------------------------------------------
function firstIssue(error: any) {
  return error?.issues?.[0] ?? {};
}

// ---------------------------------------------------------------------------
// Public‑method basic tests
// ---------------------------------------------------------------------------
describe('$ZodIPv6 – basic public API', () => {
  test('parse – accepts a canonical IPv6 address', () => {
    const schema = $ZodIPv6();
    const input = '2001:0db8:85a3:0000:0000:8a2e:0370:7334';
    expect(schema.parse(input)).toBe(input);
  });

  test('safeParse – returns success for a compressed IPv6 address', () => {
    const schema = $ZodIPv6();
    const result = schema.safeParse('2001:db8::8a2e:370:7334');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe('2001:db8::8a2e:370:7334');
  });

  test('refine – custom predicate can reject a valid IPv6 address', () => {
    const schema = $ZodIPv6().refine(
      (val) => !val.startsWith('2001'),
      { message: 'IPv6 must not start with 2001' }
    );
    const result = schema.safeParse('2001:db8::1');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('IPv6 must not start with 2001');
    }
  });
});

// ---------------------------------------------------------------------------
// Edge‑case & exception handling tests
// ---------------------------------------------------------------------------
describe('$ZodIPv6 – edge cases & internal behaviour', () => {
  test('parse – rejects empty string and strings with illegal characters', () => {
    const schema = $ZodIPv6();
    expect(() => schema.parse('')).toThrow();
    expect(() => schema.parse('2001:db8::g123')).toThrow();
  });

  test('parse – accepts upper‑case hex and embedded IPv4 notation', () => {
    const schema = $ZodIPv6();
    expect(schema.parse('2001:DB8::1')).toBe('2001:DB8::1');
    expect(schema.parse('::ffff:192.0.2.128')).toBe('::ffff:192.0.2.128');
  });

  test('check – zone identifier is rejected and abort flag influences issue.continue', () => {
    // abort = true (default) → continue = false
    const schemaAbort = $ZodIPv6({ abort: true } as any);
    const resultAbort = schemaAbort.safeParse('fe80::1%eth0');
    expect(resultAbort.success).toBe(false);
    if (!resultAbort.success) {
      const issue = firstIssue(resultAbort.error);
      expect(issue.code).toBe('invalid_format');
      expect(issue.continue).toBe(false);
    }

    // abort = false → continue = true
    const schemaNoAbort = $ZodIPv6({ abort: false } as any);
    const resultNoAbort = schemaNoAbort.safeParse('fe80::1%eth0');
    expect(resultNoAbort.success).toBe(false);
    if (!resultNoAbort.success) {
      const issue = firstIssue(resultNoAbort.error);
      expect(issue.continue).toBe(true);
    }
  });

  test('internal bag – format is set to "ipv6" on attach', () => {
    const schema = $ZodIPv6();
    const bag = (schema as any)._zod?.bag as { format?: string };
    expect(bag?.format).toBe('ipv6');
  });

  test('parse – rejects IPv6 with more than 8 groups', () => {
    const schema = $ZodIPv6();
    const tooMany = '2001:db8:0:0:0:0:0:0:1'; // 9 groups
    expect(() => schema.parse(tooMany)).toThrow();
  });
});
