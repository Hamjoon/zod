# Tuple Too-Big Signal Comparison

Coverage identical: yes

| Variant | Lines | Statements | Branches | Functions | Mutants killed | Mutants survived |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `current` | 14% | 13.1% | 4.13% | 8.05% | 3 | 0 |
| `weak-repair` | 14% | 13.1% | 4.13% | 8.05% | 0 | 3 |

Interpretation:

- Coverage sees both repairs as equivalent because both execute the same tuple too_big branch.
- StrykerJS separates the repairs: the full snapshot repair kills all three focused mutants, while the weak repair kills none.
