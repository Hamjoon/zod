"""Stage S n124: the LLM half of replay-survival.py for the n124 passing set, one release at a time, in Docker.
Reuses the release trees as they are; never touches the developer corpus or the frozen-test snapshot.
The copied build-status.json files are left byte-identical; the probe output goes to llm-probe.txt.
Restores the wrapper symlink even when a gate fails."""
import json,math,os,subprocess,time
from pathlib import Path
E=Path('/work/zod/experiments/testpilot-2026-09');V=Path('/work/zod-versions');W=E/'wrappers/zod';OUT=E/'results/survival-n124'
PASSING='results/gen-n124-passing.json';TESTS='results/gen-n124-run2/tests'
tags=[r['tag'] for r in json.loads((OUT/'tags.json').read_text())];N=len(json.loads((E/PASSING).read_text()))
def log(s):
 with (E/'docs/log-stage-s-n124.md').open('a') as f:f.write(s+'\n')
def run(cmd,cwd=E,output=None):
 start=time.monotonic();p=subprocess.run(cmd,cwd=cwd,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
 if output:output.write_text(p.stdout+f'\nexit={p.returncode}\n')
 log(f'- cwd `{cwd}`: `{" ".join(map(str,cmd))}` -> exit {p.returncode}, {time.monotonic()-start:.3f}s'+(f'; `{output.relative_to(E)}`' if output else '; '+p.stdout.strip()))
 return p
original=os.readlink(W/'node_modules/zod');assert original=='../../../../../packages/zod',original
probe=['node','-e',"const z=require('zod'); console.log(require('zod/package.json').version, typeof z.z, typeof z.z.string)"]
limit=math.ceil(0.01*N);started=time.monotonic()
log(f'\n## Step 2 driver run (replay-survival-n124.py)\n\n- |S124| = {N}; raw files expected per release: {2*N}; control allowance: ceil(1% of {N}) = {limit} non-passes.')
try:
 for t in tags:
  out=OUT/t;b=json.loads((out/'build-status.json').read_text())
  assert b['build'],f'{t}: copied build-status says the build failed'
  (W/'node_modules/zod').unlink();(W/'node_modules/zod').symlink_to(V/t/'packages/zod');log(f'- {t}: wrapper symlink -> {os.readlink(W/"node_modules/zod")}')
  p=run(probe,W,out/'llm-probe.txt');assert p.returncode==0 and p.stdout.strip()==f'{t[1:]} object function',f'{t}: probe printed {p.stdout.strip()!r}'
  p=run(['python3','scripts/run-survival-llm.py','--release',t,'--out',str(out),'--passing',PASSING,'--tests',TESTS])
  if p.returncode:raise RuntimeError(p.stdout)
  assert not (W/'test-s').exists();raw=len(list((out/'llm-raw').iterdir()));assert raw==2*N,raw
  log(f'- {t}: scratch absent; {raw} raw files confirmed.');print(p.stdout,flush=True)
  rows=json.loads((out/'llm-results.json').read_text());assert len(rows)==N;bad=[r for r in rows if r['status']!='pass']
  if t=='v4.0.5':
   log(f'- LLM control non-passes (flaky at t, {len(bad)} of allowed {limit}): '+json.dumps([{k:r[k] for k in ('run','testName','api','status','err')} for r in bad]))
   assert len(bad)<=limit,'LLM control gate failed'
finally:
 (W/'node_modules/zod').unlink();(W/'node_modules/zod').symlink_to(original);p=run(probe,W)
 assert p.returncode==0 and p.stdout.strip()=='4.0.5 object function';assert not (W/'test-s').exists()
 log(f'- Original wrapper target restored and verified (4.0.5 object function); no test-s. Driver wall {time.monotonic()-started:.3f}s.')
