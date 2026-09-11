# RQ2 import audit

| run | unit | technique | CUT import | non-CUT total | resolved | unresolved | named not exported | relative .js | relative no .js | duplicate names |
|---|---|---|---|---:|---:|---:|---:|---:|---:|---|
| week1 | 086-$ZodCheckUpperCase | COT | absent | 1 | 1 | 0 | 0 | 0 | 0 | — |
| week1 | 086-$ZodCheckUpperCase | GTOT | present_unresolved | 3 | 2 | 1 | 1 | 0 | 2 | — |
| week1 | 098-$ZodType | COT | present_unresolved | 1 | 1 | 0 | 0 | 0 | 0 | — |
| week1 | 098-$ZodType | GTOT | present_unresolved | 3 | 3 | 0 | 2 | 0 | 2 | — |
| week1 | 098-$ZodType | TOT | present_unresolved | 5 | 4 | 1 | 3 | 0 | 4 | — |
| week1 | 053-ZodEnum | COT | present_unresolved | 1 | 1 | 0 | 0 | 0 | 0 | — |
| week1 | 053-ZodEnum | GTOT | present_unresolved | 1 | 1 | 0 | 0 | 0 | 0 | — |
| week1 | 053-ZodEnum | TOT | present_unresolved | 1 | 1 | 0 | 0 | 0 | 0 | — |
| week1 | 038-ZodNull | COT | present_unresolved | 1 | 1 | 0 | 0 | 0 | 0 | — |
| week1 | 038-ZodNull | GTOT | present_unresolved | 2 | 2 | 0 | 0 | 0 | 0 | — |
| week1 | 038-ZodNull | TOT | present_unresolved | 1 | 1 | 0 | 0 | 0 | 0 | — |
| week1 | 231-ZodMiniLazy | COT | present_unresolved | 2 | 1 | 1 | 0 | 0 | 1 | — |
| week1 | 231-ZodMiniLazy | GTOT | present_unresolved | 2 | 2 | 0 | 0 | 0 | 0 | — |
| week1 | 231-ZodMiniLazy | TOT | present_unresolved | 2 | 1 | 1 | 0 | 0 | 1 | — |
| week2 | 086-$ZodCheckUpperCase | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | — |
| week2 | 086-$ZodCheckUpperCase | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | — |
| week2 | 086-$ZodCheckUpperCase | TOT | given_specifier_resolves | 3 | 3 | 0 | 2 | 2 | 0 | — |
| week2 | 098-$ZodType | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | — |
| week2 | 098-$ZodType | GTOT | given_specifier_resolves | 3 | 3 | 0 | 1 | 2 | 0 | — |
| week2 | 098-$ZodType | TOT | given_specifier_resolves | 4 | 3 | 1 | 2 | 0 | 3 | — |
| week2 | 053-ZodEnum | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | — |
| week2 | 053-ZodEnum | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | — |
| week2 | 053-ZodEnum | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | — |
| week2 | 038-ZodNull | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | — |
| week2 | 038-ZodNull | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | — |
| week2 | 038-ZodNull | TOT | given_specifier_resolves | 2 | 2 | 0 | 0 | 0 | 0 | — |
| week2 | 231-ZodMiniLazy | COT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | — |
| week2 | 231-ZodMiniLazy | GTOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | — |
| week2 | 231-ZodMiniLazy | TOT | given_specifier_resolves | 1 | 1 | 0 | 0 | 0 | 0 | — |

## Summary

```json
{
  "week1": {
    "files": 14,
    "cut_import_counts": {
      "absent": 1,
      "present_unresolved": 13
    },
    "non_cut_imports_total": 26,
    "non_cut_imports_unresolved": 4,
    "non_cut_named_imports_not_exported": 6,
    "relative_non_cut_with_js": 0,
    "relative_non_cut_without_js": 10
  },
  "week2": {
    "files": 15,
    "cut_import_counts": {
      "given_specifier_resolves": 15
    },
    "non_cut_imports_total": 23,
    "non_cut_imports_unresolved": 1,
    "non_cut_named_imports_not_exported": 5,
    "relative_non_cut_with_js": 4,
    "relative_non_cut_without_js": 3
  }
}
```
