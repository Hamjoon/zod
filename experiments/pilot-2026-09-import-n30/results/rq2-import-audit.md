# RQ2 import audit

| run | unit | technique | CUT import | non-CUT total | resolved | unresolved | named not exported | relative .js | relative no .js | CUT calls without `new` | CUT `new` expressions | duplicate names |
|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| n30 | 086-$ZodCheckUpperCase | GTOT | given_specifier_resolves | 2 | 2 | 0 | 1 | 1 | 0 | 0 | 0 | $ZodCheckUpperCase×2 |
| n30 | 086-$ZodCheckUpperCase | TOT | given_specifier_resolves | 3 | 3 | 0 | 2 | 2 | 0 | 0 | 9 | — |
| n30 | 098-$ZodType | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | — |
| n30 | 098-$ZodType | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | — |
| n30 | 098-$ZodType | TOT | present_unresolved | 3 | 2 | 1 | 0 | 0 | 2 | 6 | 0 | — |
| n30 | 053-ZodEnum | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | — |
| n30 | 053-ZodEnum | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | — |
| n30 | 053-ZodEnum | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 11 | — |
| n30 | 038-ZodNull | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 038-ZodNull | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 2 | 0 | — |
| n30 | 038-ZodNull | TOT | given_specifier_resolves | 2 | 2 | 0 | 0 | 0 | 0 | 1 | 0 | — |
| n30 | 231-ZodMiniLazy | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 10 | — |
| n30 | 231-ZodMiniLazy | GTOT | given_specifier_resolves | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 231-ZodMiniLazy | TOT | given_specifier_resolves | 2 | 2 | 0 | 0 | 0 | 0 | 1 | 0 | — |
| n30 | 117-$ZodIPv6 | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 6 | 0 | — |
| n30 | 117-$ZodIPv6 | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 9 | 0 | — |
| n30 | 117-$ZodIPv6 | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 2 | — |
| n30 | 088-$ZodCheckStartsWith | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 088-$ZodCheckStartsWith | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 088-$ZodCheckStartsWith | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 6 | — |
| n30 | 140-$ZodUnion | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 13 | 0 | — |
| n30 | 140-$ZodUnion | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | — |
| n30 | 140-$ZodUnion | TOT | given_specifier_resolves | 2 | 2 | 0 | 0 | 1 | 0 | 12 | 0 | — |
| n30 | 087-$ZodCheckIncludes | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 8 | — |
| n30 | 087-$ZodCheckIncludes | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | — |
| n30 | 087-$ZodCheckIncludes | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 8 | — |
| n30 | 130-$ZodSymbol | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 3 | 0 | — |
| n30 | 130-$ZodSymbol | GTOT | given_specifier_resolves | 2 | 2 | 0 | 0 | 0 | 0 | 3 | 0 | — |
| n30 | 130-$ZodSymbol | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 147-$ZodEnum | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 18 | 0 | — |
| n30 | 147-$ZodEnum | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 8 | 0 | — |
| n30 | 147-$ZodEnum | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 4 | 0 | — |
| n30 | 159-$ZodPipe | COT | given_specifier_resolves | 2 | 1 | 1 | 0 | 0 | 1 | 0 | 7 | — |
| n30 | 159-$ZodPipe | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 159-$ZodPipe | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 2 | 0 | — |
| n30 | 153-$ZodDefault | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 8 | — |
| n30 | 153-$ZodDefault | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 9 | — |
| n30 | 153-$ZodDefault | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 105-$ZodEmoji | COT | given_specifier_resolves | 2 | 2 | 0 | 0 | 0 | 0 | 1 | 0 | — |
| n30 | 105-$ZodEmoji | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 105-$ZodEmoji | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | — |
| n30 | 137-$ZodDate | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | — |
| n30 | 137-$ZodDate | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 13 | — |
| n30 | 137-$ZodDate | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | — |
| n30 | 055-ZodFile | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | — |
| n30 | 055-ZodFile | GTOT | given_specifier_resolves | 2 | 2 | 0 | 0 | 0 | 0 | 12 | 0 | — |
| n30 | 055-ZodFile | TOT | given_specifier_resolves | 2 | 2 | 0 | 0 | 0 | 0 | 20 | 0 | — |
| n30 | 013-ZodUUID | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 013-ZodUUID | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 013-ZodUUID | TOT | given_specifier_resolves | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 036-ZodSymbol | COT | given_specifier_resolves | 2 | 2 | 0 | 0 | 0 | 0 | 15 | 0 | — |
| n30 | 036-ZodSymbol | GTOT | given_specifier_resolves | 2 | 2 | 0 | 0 | 0 | 0 | 9 | 0 | — |
| n30 | 036-ZodSymbol | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 8 | 0 | — |
| n30 | 062-ZodSuccess | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 2 | — |
| n30 | 062-ZodSuccess | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 062-ZodSuccess | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 6 | — |
| n30 | 003-ZodISODateTime | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 003-ZodISODateTime | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 003-ZodISODateTime | TOT | given_specifier_resolves | 2 | 2 | 0 | 0 | 0 | 0 | 7 | 0 | — |
| n30 | 021-ZodKSUID | COT | given_specifier_resolves | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 021-ZodKSUID | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 021-ZodKSUID | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 058-ZodNullable | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 058-ZodNullable | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 5 | 0 | — |
| n30 | 058-ZodNullable | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 8 | — |
| n30 | 168-ZodMiniISODate | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 168-ZodMiniISODate | GTOT | other_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 168-ZodMiniISODate | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 210-ZodMiniDiscriminatedUnion | COT | given_specifier_resolves | 3 | 1 | 2 | 0 | 0 | 2 | 0 | 7 | — |
| n30 | 210-ZodMiniDiscriminatedUnion | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 197-ZodMiniBigInt | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 24 | 0 | — |
| n30 | 197-ZodMiniBigInt | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 18 | 0 | — |
| n30 | 197-ZodMiniBigInt | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 3 | 0 | — |
| n30 | 206-ZodMiniDate | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 206-ZodMiniDate | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 25 | 0 | — |
| n30 | 206-ZodMiniDate | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | — |
| n30 | 205-ZodMiniVoid | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | — |
| n30 | 205-ZodMiniVoid | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | — |
| n30 | 205-ZodMiniVoid | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 6 | — |
| n30 | 232-ZodMiniPromise | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 21 | 0 | — |
| n30 | 232-ZodMiniPromise | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 17 | — |
| n30 | 232-ZodMiniPromise | TOT | given_specifier_resolves | 2 | 2 | 0 | 1 | 1 | 0 | 15 | 0 | — |
| n30 | 211-ZodMiniIntersection | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 211-ZodMiniIntersection | GTOT | given_specifier_resolves | 2 | 2 | 0 | 4 | 1 | 0 | 6 | 0 | — |
| n30 | 211-ZodMiniIntersection | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| n30 | 181-ZodMiniCUID2 | GTOT | given_specifier_resolves | 2 | 2 | 0 | 0 | 0 | 0 | 10 | 0 | — |
| n30 | 181-ZodMiniCUID2 | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |

## Summary

```json
{
  "n30": {
    "files": 87,
    "cut_import_counts": {
      "given_specifier_resolves": 85,
      "present_unresolved": 1,
      "other_specifier_resolves": 1
    },
    "non_cut_imports_total": 111,
    "non_cut_imports_unresolved": 4,
    "non_cut_named_imports_not_exported": 8,
    "relative_non_cut_with_js": 6,
    "relative_non_cut_without_js": 5,
    "files_with_cut_calls_without_new": 39,
    "cut_calls_without_new": 296,
    "files_using_new_on_cut": 22,
    "cut_new_expressions": 142
  }
}
```
