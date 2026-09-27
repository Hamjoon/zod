"""Sequential frozen-corpus replay in Docker; restore wrapper even at a failed gate."""
import collections,hashlib,json,os,shutil,subprocess,time
from pathlib import Path
E=Path('/work/zod/experiments/testpilot-2026-09');V=Path('/work/zod-versions');W=E/'wrappers/zod';tags=[r['tag'] for r in json.loads((E/'results/survival/tags.json').read_text())]
def log(s):
 with (E/'docs/log-stage-s.md').open('a') as f:f.write(s+'\n')
def run(cmd,cwd=E,output=None):
 start=time.monotonic();p=subprocess.run(cmd,cwd=cwd,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
 if output:output.write_text(p.stdout+f'\nexit={p.returncode}\n')
 log(f'- cwd `{cwd}`: `{" ".join(map(str,cmd))}` -> exit {p.returncode}, {time.monotonic()-start:.3f}s'+(f'; `{output.relative_to(E)}`' if output else '; '+p.stdout.strip()))
 return p
original=os.readlink(W/'node_modules/zod');assert original=='../../../../../packages/zod',original
probe=['node','-e',"const z=require('zod'); console.log(require('zod/package.json').version, typeof z.z, typeof z.z.string)"]
try:
 for t in tags:
  out=E/'results/survival'/t;b=json.loads((out/'build-status.json').read_text())
  if not b['build']:log(f'- {t}: LLM skipped: build failed.');continue
  (W/'node_modules/zod').unlink();(W/'node_modules/zod').symlink_to(V/t/'packages/zod');log(f'- {t}: wrapper symlink -> {os.readlink(W/"node_modules/zod")}')
  p=run(probe,W,out/'llm-probe.txt');ok=p.returncode==0 and p.stdout.strip()==f'{t[1:]} object function';b['probe']='ok' if ok else 'failed';(out/'build-status.json').write_text(json.dumps(b,indent=2)+'\n')
  if not ok:log(f'- {t}: probe failed; excluded from LLM test counts.');continue
  p=run(['python3','scripts/run-survival-llm.py','--release',t,'--out',str(out)])
  if p.returncode:raise RuntimeError(p.stdout)
  assert not (W/'test-s').exists();assert len(list((out/'llm-raw').iterdir()))==278
  log(f'- {t}: scratch absent; 278 raw files confirmed.');print(p.stdout,flush=True)
  rows=json.loads((out/'llm-results.json').read_text());bad=[r for r in rows if r['status']!='pass']
  if t=='v4.0.5':
   log('- LLM control non-passes (flaky at t): '+json.dumps(bad));assert len(bad)<=3,'LLM control gate failed'
finally:
 (W/'node_modules/zod').unlink();(W/'node_modules/zod').symlink_to(original);p=run(probe,W);assert p.returncode==0 and p.stdout.strip()=='4.0.5 object function';assert not (W/'test-s').exists();log('- Original wrapper target restored and verified.')
# Frozen snapshot prevents deleting the source when control undergoes the same replacement.
snapshot=V/'frozen-v4.0.5-tests';snapshot.mkdir(exist_ok=False);base=V/'v4.0.5/packages/zod/src/v4'
dirs=sorted(p.relative_to(base) for p in base.rglob('tests') if p.is_dir())
for d in dirs:shutil.copytree(base/d,snapshot/d)
log('- D-12: copied v4.0.5 tests to /work/zod-versions/frozen-v4.0.5-tests before replacement. Literal T0 self-delete would erase control/source tests. Every release including control uses the same snapshot replacement.')
def hashes(root):return {str(p.relative_to(root)):hashlib.sha256(p.read_bytes()).hexdigest() for p in root.rglob('*') if p.is_file() and 'tests' in p.relative_to(root).parts}
expected=hashes(snapshot)
for t in tags:
 out=E/'results/survival'/t;root=V/t/'packages/zod/src/v4';start=time.monotonic();current=sorted(p.relative_to(root) for p in root.rglob('tests') if p.is_dir())
 (out/'tests-dirs-release.txt').write_text(''.join('./'+str(d)+'\n' for d in current));(out/'tests-dirs-t.txt').write_text(''.join('./'+str(d)+'\n' for d in dirs));log(f'- {t}: tests directory diff exit={int(current!=dirs)}, release={list(map(str,current))}, baseline={list(map(str,dirs))}.')
 for d in current:shutil.rmtree(root/d)
 for d in dirs:shutil.copytree(snapshot/d,root/d)
 assert hashes(root)==expected;count=len([p for p in root.rglob('*.test.ts') if 'tests' in p.relative_to(root).parts]);assert count==81,count
 log(f'- {t}: remove release tests directories; copy frozen tests; SHA256 mapping identical to baseline, {count} .test.ts files.')
 cmd=['npx','vitest','run','src/v4','--typecheck.enabled=false','--reporter=default','--reporter=json','--outputFile.json='+str(out/'dev-run.json')]
 p=run(cmd,root.parents[1],out/'dev-stdout.txt')
 status={'release':t,'vitestExitCode':p.returncode,'typecheckFlagAccepted':True,'harness':'ok'}
 if not (out/'dev-run.json').exists():
  status['harness']='failed';status['typecheckFlagAccepted']=None;log(f'- {t}: dev harness failed; see dev-stdout.txt.')
  if t=='v4.0.5':raise RuntimeError('Dev control did not produce JSON: '+p.stdout[-3000:])
 else:
  s=run(['python3','scripts/summarize-dev-run.py','--release',t,'--out',str(out)])
  if s.returncode:raise RuntimeError(s.stdout)
  print(s.stdout,flush=True)
 status['wallSeconds']=time.monotonic()-start;(out/'dev-status.json').write_text(json.dumps(status,indent=2)+'\n')
log('- `du -sh /work/zod-versions`: '+run(['du','-sh',str(V)]).stdout.strip())
