"""Stage C driver: for S124 and S60 in turn, point the wrapper at the coverage build, probe, run run-coverage-llm.py,
and restore the wrapper symlink in a finally block (probe 4.0.5 object function). Runs in Docker with
$ROOT/coverage-raw mounted at /work/coverage-raw."""
import json,math,os,subprocess,time
from pathlib import Path
E=Path('/work/zod/experiments/testpilot-2026-09');W=E/'wrappers/zod';COV=Path('/work/zod-versions/v4.0.5-cov/packages/zod');RAW=Path('/work/coverage-raw')
SETS=[('s124','results/gen-n124-passing.json','results/gen-n124-run2/tests'),('s60','results/gen-n60-passing.json','results/gen-n60/tests')]
def log(s):
 with (E/'docs/log-stage-c.md').open('a') as f:f.write(s+'\n')
def run(cmd,cwd=E):
 start=time.monotonic();p=subprocess.run(cmd,cwd=cwd,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
 log(f'- cwd `{cwd}`: `{" ".join(map(str,cmd))}` -> exit {p.returncode}, {time.monotonic()-start:.3f}s; {p.stdout.strip()}');return p
probe=['node','-e',"const z=require('zod'); console.log(require('zod/package.json').version, typeof z.z, typeof z.z.string)"]
original=os.readlink(W/'node_modules/zod');assert original=='../../../../../packages/zod',original
assert RAW.is_dir(),'coverage-raw not mounted'
log('\n## Step 4 driver run (replay-coverage.py)\n')
try:
 for name,passing,tests in SETS:
  n=len(json.loads((E/passing).read_text()))
  (W/'node_modules/zod').unlink();(W/'node_modules/zod').symlink_to(COV);log(f'- {name}: wrapper symlink -> {os.readlink(W/"node_modules/zod")}')
  p=run(probe,W);assert p.returncode==0 and p.stdout.strip()=='4.0.5 object function',p.stdout
  p=run(['python3','scripts/run-coverage-llm.py','--set',name,'--out',f'results/coverage/{name}','--raw',str(RAW/name),'--passing',passing,'--tests',tests])
  if p.returncode:raise RuntimeError(p.stdout)
  assert not (W/'test-s').exists()
  rows=json.loads((E/f'results/coverage/{name}/llm-results.json').read_text());assert len(rows)==n
  bad=[{k:r[k] for k in ('testName','api','status','err') if k in r}|({'run':r['run']} if 'run' in r else {}) for r in rows if r['status']!='pass'];limit=math.ceil(0.01*n)
  log(f'- {name}: {n} tests; non-passes under nyc: {len(bad)} (allowed {limit}): '+json.dumps(bad));print(p.stdout,flush=True)
  assert len(bad)<=limit,f'{name}: coverage gate failed ({len(bad)} > {limit})'
finally:
 (W/'node_modules/zod').unlink();(W/'node_modules/zod').symlink_to(original);p=run(probe,W)
 assert p.returncode==0 and p.stdout.strip()=='4.0.5 object function';assert not (W/'test-s').exists()
 log('- Original wrapper target restored and verified (4.0.5 object function); no test-s.')
