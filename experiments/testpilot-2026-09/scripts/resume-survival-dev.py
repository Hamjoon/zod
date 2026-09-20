"""Run only the pending developer releases; refuse to overwrite recorded attempts."""
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
# No downloads of a replacement test runner when release installation is unavailable.
os.environ['npm_config_yes']='false'
snapshot=V/'frozen-v4.0.5-tests'
assert snapshot.is_dir()
dirs=sorted(p.relative_to(snapshot) for p in snapshot.rglob('tests') if p.is_dir())
assert len(json.loads((E/'results/survival/v4.0.5/dev-cases.json').read_text()))==888
log('- Developer continuation: npx commands use npm_config_yes=false to prohibit implicit installation of a different Vitest (D-16). Existing release-local Vitest is used; missing runner means harness unavailable.')
def hashes(root):return {str(p.relative_to(root)):hashlib.sha256(p.read_bytes()).hexdigest() for p in root.rglob('*') if p.is_file() and 'tests' in p.relative_to(root).parts}
expected=hashes(snapshot)
for t in tags[1:]:
 out=E/'results/survival'/t
 assert not (out/'dev-stdout.txt').exists(),f'Refusing to rerun {t}'
 root=V/t/'packages/zod/src/v4';start=time.monotonic();current=sorted(p.relative_to(root) for p in root.rglob('tests') if p.is_dir())
 (out/'tests-dirs-release.txt').write_text(''.join('./'+str(d)+'\n' for d in current));(out/'tests-dirs-t.txt').write_text(''.join('./'+str(d)+'\n' for d in dirs));log(f'- {t}: tests directory diff exit={int(current!=dirs)}, release={list(map(str,current))}, baseline={list(map(str,dirs))}.')
 for d in current:shutil.rmtree(root/d)
 for d in dirs:shutil.copytree(snapshot/d,root/d)
 assert hashes(root)==expected;count=len([p for p in root.rglob('*.test.ts') if 'tests' in p.relative_to(root).parts]);assert count==81,count
 log(f'- {t}: remove release tests directories; copy frozen tests; SHA256 mapping identical to baseline, {count} .test.ts files.')
 cmd=['npx','vitest','run','src/v4','--typecheck.enabled=false','--reporter=default','--reporter=json','--outputFile.json='+str(out/'dev-run.json')]
 p=run(cmd,root.parents[1],out/'dev-stdout.txt')
 status={'release':t,'vitestExitCode':p.returncode,'typecheckFlagAccepted':True,'harness':'ok'}
 if not (out/'dev-run.json').exists():
  status['harness']='failed';status['typecheckFlagAccepted']=True if 'Startup Error' in p.stdout else None;log(f'- {t}: dev harness failed; see dev-stdout.txt.')
  if t=='v4.0.5':raise RuntimeError('Dev control did not produce JSON: '+p.stdout[-3000:])
 else:
  s=run(['python3','scripts/summarize-dev-run.py','--release',t,'--out',str(out)])
  if s.returncode:raise RuntimeError(s.stdout)
  print(s.stdout,flush=True)
 status['wallSeconds']=time.monotonic()-start;(out/'dev-status.json').write_text(json.dumps(status,indent=2)+'\n')
log('- `du -sh /work/zod-versions`: '+run(['du','-sh',str(V)]).stdout.strip())
