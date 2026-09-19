"""Replay one frozen developer corpus from the release root (addendum 2)."""
import argparse,hashlib,json,os,re,shutil,subprocess,time
from pathlib import Path
E=Path('/work/zod/experiments/testpilot-2026-09');V=Path('/work/zod-versions')
def load(p):return json.loads(p.read_text())
def write(p,data):p.write_text(json.dumps(data,indent=2)+'\n')
def log(s):
 with (E/'docs/log-stage-s.md').open('a') as f:f.write(s+'\n')
def hashes(root):return {str(p.relative_to(root)):hashlib.sha256(p.read_bytes()).hexdigest() for p in root.rglob('*') if p.is_file() and 'tests' in p.relative_to(root).parts}
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--release',required=True);a=ap.parse_args();tag=a.release;root=V/tag;out=E/'results/survival'/tag;snapshot=V/'frozen-v4.0.5-tests';src=root/'packages/zod/src/v4';start=time.monotonic()
 assert tag in [r['tag'] for r in load(E/'results/survival/tags.json')]
 assert not (out/'dev-stdout.txt').exists(),f'Refusing to overwrite {tag} attempt'
 dirs=sorted(p.relative_to(snapshot) for p in snapshot.rglob('tests') if p.is_dir());current=sorted(p.relative_to(src) for p in src.rglob('tests') if p.is_dir())
 for name,values in [('tests-dirs-release.txt',current),('tests-dirs-t.txt',dirs)]: (out/name).write_text(''.join('./'+str(d)+'\n' for d in values))
 for d in current:shutil.rmtree(src/d)
 for d in dirs:shutil.copytree(snapshot/d,src/d)
 assert hashes(src)==hashes(snapshot)
 assert len(list(src.glob('**/tests/**/*.test.ts')))==81
 log(f'- {tag}: replace all tests directories from frozen snapshot; SHA256 mapping identical, 81 test files; directory lists recorded.')
 suffix=['--reporter=default','--reporter=json','--outputFile.json='+str(out/'dev-run.json')]
 primary=['npx','vitest','run','--project','zod','packages/zod/src/v4','--typecheck.enabled=false',*suffix]
 attempts=[(0,root,primary),(1,root,[x for x in primary if x not in ['--project','zod']]),(2,root,[x for x in primary if x!='--typecheck.enabled=false'])]
 if tag in ('v4.0.5','v4.1.0'):attempts.append((3,root/'packages/zod',['npx','vitest','run','src/v4','--typecheck.enabled=false',*suffix]))
 env=dict(os.environ,npm_config_yes='false');errors=[];state={'release':tag,'harness':'failed','fallbackUsed':None,'attempts':[]}
 log(f'- D-19 {tag}: developer command from repository root with explicit project; fallback order per addendum.')
 for fallback,cwd,cmd in attempts:
  if fallback==2:log(f'- D-20 {tag}: no JSON in prior attempts; retry without typecheck.enabled flag, then identify runtime entries by meta.typecheck (D-21).')
  t=time.monotonic();p=subprocess.run(cmd,cwd=cwd,env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT);seconds=time.monotonic()-t
  with (out/'dev-stdout.txt').open('a') as f:f.write(f'== {"primary" if not fallback else "fallback "+str(fallback)} cwd={cwd}\n$ {" ".join(cmd)}\n{p.stdout}\n== exit={p.returncode}, wallSeconds={seconds:.3f}\n')
  state.update(command=' '.join(cmd),cwd=str(cwd),vitestExitCode=p.returncode,fallbackUsed=fallback,typecheckFlagAccepted=fallback!=2);state['attempts'].append(dict(command=state['command'],cwd=str(cwd),fallback=fallback,exitCode=p.returncode,wallSeconds=seconds))
  log(f'- {tag}: cwd `{cwd}` npm_config_yes=false `{state["command"]}` -> exit {p.returncode}, {seconds:.3f}s; appended dev-stdout.txt.')
  plain=re.sub(r'\x1b\[[0-9;]*m','',p.stdout);errors.append('\n'.join(l for l in plain.splitlines() if l.strip())[:1000])
  if not (out/'dev-run.json').exists():continue
  data=load(out/'dev-run.json')
  valid=isinstance(data.get('testResults'),list) and all(isinstance(f.get('assertionResults'),list) and all(isinstance(c.get('meta'),dict) for c in f['assertionResults']) for f in data['testResults'])
  if not valid:
   state['error']='Unrecognized JSON shape: expected testResults[].assertionResults[] with meta objects';log(f'- {tag}: {state["error"]}; raw JSON retained.');break
  runtime=[f for f in data['testResults'] if not any(c.get('meta',{}).get('typecheck') is True for c in f['assertionResults'])]
  state['runtimeSplit']='meta.typecheck';state['typecheckFlagEffective']=len(runtime)==len(data['testResults'])
  log(f'- D-21 {tag}: runtime entries exclude only those with any assertion meta.typecheck=true; {len(runtime)} runtime entries; raw JSON unchanged.')
  cmd=['python3',str(E/'scripts/summarize-dev-run.py'),'--release',tag,'--out',str(out)];s=subprocess.run(cmd,cwd=E,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
  log(f'- {tag}: `{" ".join(cmd)}` -> exit {s.returncode}; {s.stdout.strip()}')
  if s.returncode:
   state['error']=s.stdout;state['wallSeconds']=time.monotonic()-start;write(out/'dev-status.json',state);raise RuntimeError(s.stdout)
  state['harness']='ok';break
 if state['harness']!='ok':state.setdefault('error','\n\n'.join(errors));log(f'- {tag}: dev harness failed after fallbacks; exact errors retained.')
 state['wallSeconds']=time.monotonic()-start;write(out/'dev-status.json',state)
 if tag in ('v4.0.5','v4.1.0'):
  assert state['harness']=='ok',f'{tag} gate: no developer result'
  summary=load(out/'dev-summary.json')
  if tag=='v4.0.5':assert (summary['files'],summary['cases'],summary['passed'])==(81,888,888);log('- v4.0.5 gate passed: 81 files / 888 cases / 888 passed.')
  else:
   identity=lambda c:(c['file'],c['fullName'],c['occurrence'])
   before={identity(c) for c in load(out/'dev-attempt1/dev-cases.json') if c['status']=='failed'};after={identity(c) for c in load(out/'dev-cases.json') if c['status']=='failed'}
   comparison={'passed':summary['passed'],'failed':summary['failed'],'identicalFailingSet':before==after,'removed':sorted(before-after),'added':sorted(after-before)}
   (out/'dev-attempt-compare.txt').write_text(json.dumps(comparison,indent=2)+'\n');log('- v4.1.0 gate comparison: '+json.dumps(comparison));assert (summary['passed'],summary['failed'])==(871,17) and before==after,'v4.1.0 equivalence gate failed'
 print(json.dumps(state),flush=True)
if __name__=='__main__':main()
