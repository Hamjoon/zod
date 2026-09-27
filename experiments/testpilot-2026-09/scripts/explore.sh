#!/bin/bash
set -euo pipefail
TP=/work/testpilot2
EXP=/work/zod/experiments/testpilot-2026-09
exec > >(tee -a "$EXP/docs/log-stage0-explore.md") 2>&1
set -x
COMMON=(--responses "$EXP/mock/prompts.json" --strictResponses false --template "$TP/templates/template-singletest.hb" --retryTemplate "$TP/templates/retry-template.hb" --snippets doc --numSnippets all --snippetLength 20 --numCompletions 5 --temperatures 0.0 --maxTokens 1000)
cd "$TP"
run() {
  local condition="$1" package="$2" start end rc
  test ! -e "$EXP/results/explore-$condition"
  start=$(date +%s.%N)
  set +e
  node benchmark/run.js --outputDir "$EXP/results/explore-$condition" --package "$package" "${COMMON[@]}" > "$EXP/results/explore-$condition.stdout.txt" 2>&1
  rc=$?
  set -e
  end=$(date +%s.%N)
  python3 -c 'import sys,json; print(json.dumps(dict(condition=sys.argv[1],seconds=float(sys.argv[3])-float(sys.argv[2]),exit=int(sys.argv[4]))))' "$condition" "$start" "$end" "$rc" >> "$EXP/results/exploration-timing.jsonl"
  tail -8 "$EXP/results/explore-$condition.stdout.txt"
  test "$rc" -eq 0
  for f in api.json snippetMap.json prompts.json prompts report.json; do test -e "$EXP/results/explore-$condition/$f"; done
  jq -e '.stats.nrTests == 0' "$EXP/results/explore-$condition/report.json"
}
test ! -e /work/zod/packages/zod/.snippet-docs
test ! -e "$EXP/wrappers/zod-mini/.snippet-docs"
run main-native /work/zod/packages/zod
run mini-native "$EXP/wrappers/zod-mini"
cd /work/zod
find packages/zod -name '*.md' -not -path '*/node_modules/*' -not -path '*/.snippet-docs/*' > "$EXP/results/native-doc-files.txt"
python3 - <<'PY'
from pathlib import Path
import shutil
src=Path('/work/zod/packages/docs/content')
destinations=[Path('/work/zod/packages/zod/.snippet-docs'),Path('/work/zod/experiments/testpilot-2026-09/wrappers/zod-mini/.snippet-docs')]
files=sorted(p for p in src.rglob('*') if p.suffix in ('.md','.mdx'))
for dest in destinations:
    dest.mkdir(parents=True)
    for f in files:
        out=dest/f.relative_to(src).with_suffix('.md')
        out.parent.mkdir(parents=True,exist_ok=True)
        shutil.copyfile(f,out)
    print(str(dest),len(list(dest.rglob('*.md'))))
shutil.copyfile('/work/zod/packages/zod/README.md','/work/zod/experiments/testpilot-2026-09/wrappers/zod-mini/README.md')
Path('/work/zod/experiments/testpilot-2026-09/results/website-doc-files.txt').write_text('\n'.join(str(p.relative_to(src)) for p in files)+'\n')
PY
cat "$EXP/results/native-doc-files.txt"
cd "$TP"
run main-docs /work/zod/packages/zod
run mini-docs "$EXP/wrappers/zod-mini"
node "$TP/dist/exploreAPI.js" /work/zod/packages/zod > "$EXP/results/explore-main-raw.json"
node "$TP/dist/exploreAPI.js" "$EXP/wrappers/zod-mini" > "$EXP/results/explore-mini-raw.json"
rm -rf /work/zod/packages/zod/.snippet-docs "$EXP/wrappers/zod-mini/.snippet-docs" "$EXP/wrappers/zod-mini/README.md"
git -C /work/zod status --porcelain
